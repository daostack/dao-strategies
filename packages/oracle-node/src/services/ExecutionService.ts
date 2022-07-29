import { WorldConfig, bigIntToNumber } from '@dao-strategies/core';

import { appLogger } from '../logger';
import { Services } from '../types';

export interface ExecutionConfig {
  world: WorldConfig;
  executionWatcher: {
    enabled: boolean;
    period: number;
  };
  republishWatcher: {
    enabled: boolean;
    period: number;
  };
}

/**
 * The only point in the app from which a campaign execution can be triggered.
 *
 * It includes a watcher service that looks for incoming campaigns and
 * schedule their up-to-the-second on-time execution.
 *
 * A service that periodically fetches data about the campaigns and prepares for
 * their on-time execution.
 *
 * The DB is reviewed every executionWatcher.period seconds, and campaigns that should be executed in the next
 * executionWatcher.period seconds are scheduled to run using setTimeout.
 *
 * Retroactive campaigns are campaigns that were "simulated" during their creation.
 * In this case the simulation is considered "the" exection, and are marked as executed.
 *  */

export class ExecuteService {
  executionCicle: NodeJS.Timer;
  republishCicle: NodeJS.Timer;
  schedulled: Set<string> = new Set();
  executing: Map<string, Promise<void>> = new Map();
  publishing: Map<string, Promise<void>> = new Map();

  constructor(protected services: Services, protected config: ExecutionConfig) {
    if (this.config.executionWatcher.enabled) {
      this.startExecutionWatcher();
    }
    if (this.config.republishWatcher.enabled) {
      this.startRepublishWatcher();
    }
  }

  startExecutionWatcher(): void {
    void this.checkExecution();
    this.executionCicle = setInterval(() => {
      void this.checkExecution();
    }, this.config.executionWatcher.period * 1000);
  }

  startRepublishWatcher(): void {
    void this.checkRepublish();
    this.republishCicle = setInterval(() => {
      void this.checkRepublish();
    }, this.config.republishWatcher.period * 1000);
  }

  async checkExecution(): Promise<void> {
    const now = this.services.time.now();

    const incoming = await this.services.campaign.findPendingExecution(
      now + this.config.executionWatcher.period
    );

    appLogger.info(`Check Incoming Executions ${now}`);

    await Promise.all(
      incoming.map(async (uri) => {
        await this.scheduleExecute(uri, now);
      })
    );
  }

  /**
   * Check for campaigns that have a republishDate less than now (note that
   * republish is not setTimeout triggered to target an under-the-second
   * accuracy (which is the case for execution))
   */
  async checkRepublish(): Promise<void> {
    const now = this.services.time.now();

    const incoming = await this.services.campaign.findPendingRepublish(now);

    appLogger.info(`Check Incoming Republishing ${now}`);

    await Promise.all(
      incoming.map(async (uri) => {
        await this.publish(uri);
      })
    );
  }

  async scheduleExecute(uri: string, now: number): Promise<void> {
    /** don't schedule an already schedulled task */
    if (this.schedulled.has(uri)) {
      return;
    }

    const campaign = await this.services.campaign.get(uri);

    this.schedulled.add(campaign.uri);

    const delay = bigIntToNumber(campaign.execDate) - now;

    const callback = async (): Promise<void> => {
      await this.execute(campaign.uri, now + delay);
      await this.publish(campaign.uri);
      this.schedulled.delete(campaign.uri);
    };

    appLogger.info(
      `Preparing execution of ${campaign.uri} in ${delay} seconds`
    );
    setTimeout(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      callback,
      delay * 1000
    );
  }

  /**
   * will only execute and publish if the correct conditions are met. Safe to call
   * just to ne sure it's exectued and published
   */
  async executeAndPublish(uri: string, now: number): Promise<void> {
    await this.execute(uri, now);
    await this.publish(uri);
  }

  /** single point from which a campaign execution and publishing is done */
  async execute(uri: string, now: number): Promise<void> {
    /** reentrancy protection */
    const executing = this.executing.get(uri);
    if (executing !== undefined) {
      return executing;
    }

    const _execute = (async (): Promise<void> => {
      const campaign = await this.services.campaign.get(uri);

      if (campaign.executed || campaign.execDate > now) {
        /** campaign not ready to be executed */
        return;
      }

      /** rewards are computed only if they have not been yet computed (as part
       * of the campaign creation process in the UI for instance) */
      appLogger.info(`Executing ${uri}`);

      if (
        campaign.lastRunDate == null ||
        campaign.lastRunDate < campaign.execDate
      ) {
        /** campaigns that were already run are not re-run, but just
         * marked as executed */
        appLogger.info(
          `Not already executed ${campaign.uri}. About to run then.`
        );
        await this.services.campaign.runCampaign(uri, now);
      }

      await this.services.campaign.setExecuted(uri);

      appLogger.info(`Executed ${uri}`);
    })();

    this.executing.set(uri, _execute);
    await _execute;
  }

  async publish(uri: string): Promise<void> {
    /** reentrancy protection */
    const publishing = this.publishing.get(uri);
    if (publishing !== undefined) {
      return publishing;
    }

    const _publish = (async (): Promise<void> => {
      const campaign = await this.services.campaign.get(uri);

      if (!campaign.executed) {
        /** campaign not ready to be published */
        return;
      }

      await this.services.campaign.publishCampaign(uri);
    })();

    this.publishing.set(uri, publishing);
    await _publish;
  }
}
