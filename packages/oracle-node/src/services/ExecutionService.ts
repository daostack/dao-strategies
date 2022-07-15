import { WorldConfig } from '@dao-strategies/core';

import { appLogger } from '../logger';
import { Services } from '../types';
import { toNumber } from '../utils/utils';

export interface ExecutionConfig {
  world: WorldConfig;
  enabled: boolean;
  periodCheck: number;
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
 * The DB is reviewed every PERIOD_CHECK seconds, and campaigns that should be executed in the next
 * PERIOD_CHECK seconds are scheduled to run using setTimeout.
 *
 * Retroactive campaigns are campaigns that were "simulated" during their creation.
 * In this case the simulation is considered "the" exection, and are marked as executed.
 *  */

export class ExecuteService {
  cicle: NodeJS.Timer;
  schedulled: Set<string> = new Set();
  executing: Map<string, Promise<void>> = new Map();
  publishing: Map<string, Promise<void>> = new Map();

  constructor(protected services: Services, protected config: ExecutionConfig) {
    if (this.config.enabled) {
      this.startWatcher();
    }
  }

  startWatcher(): void {
    void this.checkIncoming();
    this.cicle = setInterval(() => {
      void this.checkIncoming();
    }, this.config.periodCheck * 1000);
  }

  /**
   * Check for which are either pending execution and/or pending publishing
   */
  async checkIncoming(): Promise<void> {
    const now = this.services.time.now();

    const incoming = await this.services.campaign.findPending(
      now + this.config.periodCheck
    );

    const nowUTC = new Date(now * 1000);
    appLogger.info(`Check Incoming Tasks ${nowUTC.toUTCString()}`);

    await Promise.all(
      incoming.map(async (uri) => {
        await this.scheduleExecute(uri, now);
      })
    );
  }

  async scheduleExecute(uri: string, now: number): Promise<void> {
    /** don't schedule and schedulled task */
    if (this.schedulled.has(uri)) {
      return;
    }

    const campaign = await this.services.campaign.get(uri);

    this.schedulled.add(campaign.uri);

    const delay = toNumber(campaign.execDate) - now;

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
        appLogger.info(`Already executed ${campaign.uri}`);
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

      if (!campaign.executed || campaign.published) {
        /** campaign not ready to be published */
        return;
      }

      await this.services.campaign.publishCampaign(uri);
    })();

    this.publishing.set(uri, publishing);
    await _publish;
  }
}
