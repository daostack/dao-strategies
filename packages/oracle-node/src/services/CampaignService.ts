import {
  Balances,
  StrategyComputation,
  StrategyID,
} from '@dao-strategies/core';
import { Campaign, Prisma } from '@prisma/client';
import { resimulationPeriod } from '../config';

import { CampaignRepository } from '../repositories/campaignRepository';
import {
  campaignToUriDetails,
  CampaignUriDetails,
  getCampaignUri,
} from './CampaignUri';
import { TimeService } from './TimeService';

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

  async exist(uri: string): Promise<boolean> {
    return this.campaignRepo.exist(uri);
  }

  async getOrCreateCampaign(
    details: CampaignUriDetails,
    by: string
  ): Promise<string> {
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
        stratID: details.strategyID,
        stratParamsStr: JSON.stringify(details.strategyParams),
        lastSimDate: this.timeService.now(),
      };

      this.create(details);
    }
  }

  async create(details: Prisma.CampaignCreateInput) {
    this.campaignRepo.create(details);
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
  async computeRewards(uri: string) {
    /** check if this campaign was recently simulated */
    const simDate = await this.getLastSimDate(uri);

    let rewards: Balances;

    if (
      simDate !== undefined &&
      this.timeService.getTime() - simDate > resimulationPeriod
    ) {
      rewards = await this.getRewards(uri);
    } else {
      const details = campaignToUriDetails(await this.get(uri));
      rewards = await this.run(details.strategyID, details.strategyParams);

      await this.setRewards(uri, rewards);
    }

    return rewards;
  }

  async run(strategyId: StrategyID, strategyParams: any) {
    const rewards = await this.strategyComputation.runStrategy(
      strategyId,
      strategyParams
    );

    return rewards;
  }

  async getLastSimDate(uri: string): Promise<number | undefined> {
    return this.campaignRepo.getLastSimDate(uri);
  }

  async getRewards(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewards(uri);
  }

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    return this.campaignRepo.setRewards(uri, rewards);
  }
}
