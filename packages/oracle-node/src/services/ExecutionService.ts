import { appLogger } from '../logger';
import { Services } from '../types';
import { toNumber } from '../utils/utils';

const PERIOD_CHECK = 30;

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

  constructor(protected services: Services) {
    void this.checkIncoming();
    this.cicle = setInterval(() => {
      void this.checkIncoming();
    }, PERIOD_CHECK * 1000);
  }

  /**
   * - check for campaigns whose execution date is in the next 30 seconds,
   * - store them in the running map and initialize the timeout
   */
  async checkIncoming(): Promise<void> {
    const now = this.services.time.now();

    const incoming = await this.services.campaign.findPending(
      now + PERIOD_CHECK
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

              await this.services.campaign.runCampaign(campaign);
              await this.services.campaign.setExecuted(campaign.uri);

              this.running.delete(campaign.uri);
              appLogger.info(`Executed ${campaign.uri}`);
            };

            setTimeout(
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              callback,
              toNumber(campaign.execDate) - this.services.time.now()
            );
          }
        }
      })
    );
  }
}
