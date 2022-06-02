import {
  Balances,
  CampaignUriDetails,
  getCampaignUri,
  StrategyComputation,
  Strategy_ID,
} from '@dao-strategies/core';
import { Campaign, Prisma } from '@prisma/client';

import { resimulationPeriod } from '../config';
import { appLogger } from '../logger';
import { CampaignRepository } from '../repositories/CampaignRepository';
import { toNumber } from '../utils/utils';

import { campaignToUriDetails } from './CampaignUri';
import { TimeService } from './TimeService';
import { CampaignCreateDetails } from './types';

/**
 * On Retroactive Campaign
 * =======================
 *
 * The rewards must be computed before the campaign
 * contract has been deployed (to include the merkleRoot).
 *
 * (Issue: a hacker can spam the oracle by creating thousands of different
 * campaigns, forcing us to hit the Github API rate-limit)
 *
 * - The frontend will gather the campaign configuration
 * - The frontend will call the `execute` endpoint.
 * - The oracle will compute the rewards (in terms of social ids) and return them.
 * - The frontend will show the rewards, and, if approved, deploy the smart contract.
 */

export class CampaignService {
  constructor(
    protected campaignRepo: CampaignRepository,
    protected timeService: TimeService,
    protected strategyComputation: StrategyComputation
  ) {}

  async get(uri: string): Promise<Campaign | undefined> {
    return this.campaignRepo.get(uri);
  }

  async getFromAddress(address: string): Promise<Campaign | undefined> {
    return this.campaignRepo.getFromAddress(address);
  }

  async exist(uri: string): Promise<boolean> {
    return this.campaignRepo.exist(uri);
  }

  async getOrCreate(details: CampaignUriDetails, by: string): Promise<string> {
    const uri = await getCampaignUri(details);
    const exist = await this.exist(uri);

    if (!exist) {
      const createData: Prisma.CampaignCreateInput = {
        uri,
        title: '',
        description: '',
        creator: {
          connect: {
            address: by.toLowerCase(),
          },
        },
        nonce: details.nonce,
        guardian: '',
        oracle: '',
        execDate: details.execDate,
        cancelDate: 0,
        stratID: details.strategyID as Strategy_ID,
        stratParamsStr: JSON.stringify(details.strategyParams),
        lastRunDate: undefined,
        publishDate: undefined,
        registered: false,
        running: false,
        executed: false,
        published: false,
        address: '',
      };

      const campaign = await this.create(createData);
      if (campaign.uri !== uri) {
        throw new Error('Unexepected campaign uri');
      }
    }

    return uri;
  }

  async create(details: Prisma.CampaignCreateInput): Promise<Campaign> {
    return this.campaignRepo.create(details);
  }

  /** runs the strategy, rewards are always stored on the DB overwriting the previous execution */
  async runCampaign(campaign: Campaign, _now?: number): Promise<Balances> {
    const now = _now || this.timeService.now();

    if (campaign.executed) {
      throw new Error(
        `Trying to run a campaign ${campaign.uri} that was already executed. This would had overwrite the final results`
      );
    }

    /** if it has not been run yet, it will always be run now*/
    const details = campaignToUriDetails(campaign);

    await this.campaignRepo.setRunning(campaign.uri, true);

    const rewards = await this.runStrategy(
      details.strategyID as Strategy_ID,
      details.strategyParams
    );

    await this.campaignRepo.setLastRunDate(campaign.uri, now);
    await this.setRewards(campaign.uri, rewards);

    await this.campaignRepo.setRunning(campaign.uri, false);

    return rewards;
  }

  async runCampaignThrottled(uri: string): Promise<Balances> {
    const campaign = await this.get(uri);

    /** check if this campaign was recently simulated */
    const runDate = toNumber(campaign.lastRunDate);
    const execDate = toNumber(campaign.execDate);

    let rewards: Balances;
    const now = this.timeService.now();

    if (
      runDate !== undefined &&
      (runDate >= execDate || now - runDate < resimulationPeriod)
    ) {
      /** Dont run if:
       * it has already been run and either
       *   the runDate was the execDate or later, or
       *   it was run very recently
       * */
      rewards = await this.getRewards(uri);
      appLogger.info(`rewards for strategy ${uri} read from DB`);
    } else {
      rewards = await this.runCampaign(campaign);
    }

    return rewards;
  }

  async runStrategy(
    strategyId: Strategy_ID,
    strategyParams: any
  ): Promise<Balances> {
    appLogger.info(`calling strategy ${strategyId}`);
    const rewards = await this.strategyComputation.runStrategy(
      strategyId,
      strategyParams
    );

    appLogger.info(
      `calling strategy ${strategyId} - done, ${rewards.size} receivers found`
    );

    return rewards;
  }

  async getRewards(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewards(uri);
  }

  getRewardsToAddresses(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewardsToAddresses(uri);
  }

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    return this.campaignRepo.setRewards(uri, rewards);
  }

  async register(uri: string, details: CampaignCreateDetails): Promise<void> {
    await this.campaignRepo.setDetails(uri, details);
  }

  setExecuted(uri: string): Promise<void> {
    return this.campaignRepo.setExecuted(uri, true);
  }

  findPending(time: number): Promise<Campaign[]> {
    return this.campaignRepo.findPending(time);
  }

  deleteAll(): Promise<void> {
    return this.campaignRepo.deleteAll();
  }
}
