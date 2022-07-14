import {
  Balances,
  BalanceTree,
  CampaignCreateDetails,
  CampaignUriDetails,
  getCampaignUri,
  StrategyComputation,
  Strategy_ID,
} from '@dao-strategies/core';
import {
  BalanceLeaf,
  Campaign,
  CampaignRoot,
  Prisma,
  Reward,
} from '@prisma/client';

import { resimulationPeriod } from '../config';
import { appLogger } from '../logger';
import { CampaignRepository, Leaf } from '../repositories/CampaignRepository';
import { toNumber } from '../utils/utils';

import { campaignToUriDetails } from './CampaignUri';
import { OnChainService } from './OnChainService';
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
    protected strategyComputation: StrategyComputation,
    protected onChainService: OnChainService
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

  async getOrCreate(details: CampaignUriDetails): Promise<string> {
    const uri = await getCampaignUri(details);
    const exist = await this.exist(uri);

    if (!exist) {
      const createData: Prisma.CampaignCreateInput = {
        uri,
        nonce: details.nonce,
        execDate: details.execDate,
        stratID: details.strategyID as Strategy_ID,
        stratParamsStr: JSON.stringify(details.strategyParams),
        registered: false,
        executed: false,
        published: false,
        running: false,
        isComputing: false,
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

  async runAndPublishCampaign(uri: string): Promise<void> {
    const campaign = await this.get(uri);

    await this.runCampaign(campaign);
    await this.setExecuted(uri);
    await this.publishCampaign(uri);
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
      appLogger.info(
        `rewards for strategy ${uri} read from DB. ${rewards.size} rewarded found`
      );
    } else {
      rewards = await this.runCampaign(campaign);
      appLogger.info(
        `rewards for strategy ${uri} computed. ${rewards.size} rewarded found`
      );
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

  /**  */
  async publishCampaign(uri: string): Promise<void> {
    const campaign = await this.get(uri);
    const root = await this.computeRoot(campaign);
    await this.onChainService.publishShares(campaign.address, root);
  }

  async computeRoot(campaign: Campaign): Promise<string> {
    if (!campaign.registered) {
      throw new Error(`campaign ${campaign.uri} not registered`);
    }

    if (!campaign.executed) {
      throw new Error(`campaign ${campaign.uri} not executed`);
    }

    /**
     * reentrancy protection, if isComputing wait for the computation to finish
     * and returns the latest root
     */
    const isComputing = await this.campaignRepo.getIsComputing(campaign.uri);

    if (isComputing) {
      const existingRoot = await new Promise<CampaignRoot>((resolve) => {
        setInterval(() => {
          void this.campaignRepo
            .getIsComputing(campaign.uri)
            .then((stillComputing) => {
              if (!stillComputing) {
                void this.campaignRepo
                  .getLatestRoot(campaign.uri)
                  .then((_root) => resolve(_root));
              }
            });
        }, 250);
      });

      return existingRoot.root;
    }

    /** else compute the root */
    await this.campaignRepo.setIsComputing(campaign.uri, true);

    const now = this.timeService.now();
    const rewards = await this.getRewardsToAddresses(campaign.uri);
    const tree = new BalanceTree(rewards);
    const root = tree.getHexRoot();

    const leafs = Array.from(rewards.entries()).map(
      ([account, balance]): Leaf => {
        const proof = tree.getProof(account, balance);
        return {
          account,
          balance: balance.toString(),
          proof,
        };
      }
    );

    await this.campaignRepo.addRoot(campaign.uri, root, leafs, now);
    await this.campaignRepo.setIsComputing(campaign.uri, false);

    return root;
  }

  async getRewards(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewards(uri);
  }

  getRewardsToAddresses(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewardsToAddresses(uri);
  }

  getRewardToAddress(uri: string, account: string): Promise<Reward | null> {
    return this.campaignRepo.getRewardToAddress(uri, account);
  }

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    return this.campaignRepo.setRewards(uri, rewards);
  }

  async getBalanceLeaf(
    uri: string,
    root: string,
    account: string
  ): Promise<BalanceLeaf> {
    return this.campaignRepo.getBalanceLeaf(uri, root, account);
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
