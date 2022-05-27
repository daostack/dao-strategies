import {
  Balances,
  CampaignUriDetails,
  getCampaignUri,
  StrategyComputation,
  Strategy_ID,
} from '@dao-strategies/core';
import { Campaign, Prisma } from '@prisma/client';

import { appLogger } from '..';
import { resimulationPeriod } from '../config';
import { CampaignRepository } from '../repositories/CampaignRepository';

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
            address: by,
          },
        },
        nonce: details.nonce,
        guardian: '',
        oracle: '',
        execDate: details.execDate,
        cancelDate: 0,
        stratID: details.strategyID as Strategy_ID,
        stratParamsStr: JSON.stringify(details.strategyParams),
        lastSimDate: 0,
        registered: false,
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

  /**
   * A "cached" execution of a campaign from its URI.
   *
   * A retroactive campaign is executed only once, since it's result
   * is not expected to depend on the execution date. Once executed,
   * a retroactive campaign is never re-executed.
   *
   * An open campaign (non-retroactive) is also expected to be executed
   * only once and in a future date, but it can be "simulated" many times
   * before then.
   *
   * If a campaign was recently simulated, it is not executed again,
   * instead the last-computed simulated rewards are read from the DB and
   * returned.
   *
   * */
  async computeRewards(uri: string): Promise<Balances> {
    /** check if this campaign was recently simulated */
    const simDate = await this.getLastSimDate(uri);

    let rewards: Balances;

    if (
      simDate !== undefined &&
      this.timeService.now() - simDate < resimulationPeriod
    ) {
      rewards = await this.getRewards(uri);
      appLogger.info(`rewards for strategy ${uri} read from DB`);
    } else {
      const details = campaignToUriDetails(await this.get(uri));
      rewards = await this.run(
        details.strategyID as Strategy_ID,
        details.strategyParams
      );

      await this.setRewards(uri, rewards);
      await this.campaignRepo.setLastSimDate(uri, this.timeService.now());
    }

    return rewards;
  }

  async run(strategyId: Strategy_ID, strategyParams: any): Promise<Balances> {
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

  async getLastSimDate(uri: string): Promise<number | undefined> {
    return this.campaignRepo.getLastSimDate(uri);
  }

  async setLastSimDate(uri: string, date: number): Promise<void> {
    return this.campaignRepo.setLastSimDate(uri, date);
  }

  async getRewards(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewards(uri);
  }

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    return this.campaignRepo.setRewards(uri, rewards);
  }

  async register(uri: string, details: CampaignCreateDetails): Promise<void> {
    await this.campaignRepo.setDetails(uri, details);
    void this.checkExecute(uri);
  }

  async checkExecute(uri: string): Promise<void> {
    const campaign = await this.get(uri);
    if (campaign.execDate >= this.timeService.now()) {
      console.log('SET MERKLE ROOT');
    }
  }
}
