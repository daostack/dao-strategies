import { appLogger } from '../logger';
import { Services } from '../types';
import { toNumber } from '../utils/utils';

export interface ExecutionConfig {
  enabled: boolean;
  periodCheck: number;
}

/**
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
  running: Set<string> = new Set();

  constructor(protected services: Services, protected config: ExecutionConfig) {
    if (this.config.enabled) {
      void this.checkIncoming();
      this.cicle = setInterval(() => {
        void this.checkIncoming();
      }, this.config.periodCheck * 1000);
    }
  }

  /**
   * - check for campaigns whose execution date is in the next 30 seconds,
   * - store them in the running map and initialize the timeout
   */
  async checkIncoming(): Promise<void> {
    const now = this.services.time.now();

    const incoming = await this.services.campaign.findPending(
      now + this.config.periodCheck
    );

    const nowUTC = new Date(now * 1000);
    appLogger.info(`Check Incoming Tasks ${nowUTC.toUTCString()}`);

    await Promise.all(
      incoming.map(async (campaign) => {
        if (
          !this.running.has(campaign.uri) &&
          campaign.registered &&
          !campaign.executed
        ) {
          this.running.add(campaign.uri);

          if (campaign.execDate < now && campaign.lastRunDate !== undefined) {
            /** retroactive campaigns that were already run are not re-run, but just
             * marked as executed */
            appLogger.info(`Already executed ${campaign.uri}`);
            await this.services.campaign.setExecuted(campaign.uri);
          } else {
            const callback = async (): Promise<void> => {
              appLogger.info(`Executing ${campaign.uri}`);

              await this.services.campaign.runAndPublishCampaign(campaign.uri);

              this.running.delete(campaign.uri);
              appLogger.info(`Executed ${campaign.uri}`);
            };

            const delay =
              toNumber(campaign.execDate) - this.services.time.now();

            appLogger.info(
              `Preparing execution of ${campaign.uri} in ${delay} seconds`
            );
            setTimeout(
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              callback,
              delay * 1000
            );
          }
        }
      })
    );
  }
}
