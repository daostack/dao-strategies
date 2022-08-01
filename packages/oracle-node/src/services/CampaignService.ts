import {
  Balances,
  RewardsToAddresses,
  BalanceTree,
  CampaignCreateDetails,
  CampaignUriDetails,
  getCampaignUri,
  StrategyComputation,
  Strategy_ID,
  bigIntToNumber,
  RootDetails,
} from '@dao-strategies/core';
import {
  BalanceLeaf,
  Campaign,
  CampaignRoot,
  Prisma,
  Reward,
} from '@prisma/client';
import { ethers } from 'ethers';

import { resimulationPeriod } from '../config';
import { appLogger } from '../logger';
import { CampaignRepository, Leaf } from '../repositories/CampaignRepository';
import { CampaignOnChainService } from './CampaignOnChainService';

import { campaignToUriDetails } from './CampaignUri';
import { OnChainService, ZERO_BYTES32 } from './OnChainService';
import { TimeService } from './TimeService';

export interface RootComputation {
  root: string;
  totalRewarded: number;
  totalInRoot: number;
  totalPending: number;
}

export interface CampaigServiceConfig {
  republishTimeMargin: number;
}

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
  /** keep track of campaigns for which the root is being computed */
  computingRoot: Map<string, Promise<RootComputation>> = new Map();

  /** Co-dependency between CampaignService and CampaignOnChainService :( */
  protected campaignOnChain: CampaignOnChainService;

  constructor(
    protected campaignRepo: CampaignRepository,
    protected timeService: TimeService,
    protected strategyComputation: StrategyComputation,
    protected onChainService: OnChainService,
    protected config: CampaigServiceConfig
  ) {}

  setOnChainRead(_campaignOnChain: CampaignOnChainService): void {
    this.campaignOnChain = _campaignOnChain;
  }

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
   * runs the strategy, rewards are always stored on the DB overwriting the previous execution, running a campaign
   * can be done as part of a "simulation" or as part of the final execution. There is no distinction at this level
   */
  async runCampaign(
    uri?: string,
    _now?: number,
    _campaign?: Campaign
  ): Promise<Balances> {
    const now = _now || this.timeService.now();

    const campaign = _campaign || (await this.get(uri));

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
    const runDate = bigIntToNumber(campaign.lastRunDate);
    const execDate = bigIntToNumber(campaign.execDate);

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
      rewards = await this.runCampaign(undefined, undefined, campaign);
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
    appLogger.info(`publishCampaign: ${uri}`);
    const campaign = await this.get(uri);
    /**
     * computeRoot will also save the root as a new campaign root if different from
     * the previous one
     */
    const rootDetails = await this.computeRoot(campaign);

    const publishInfo = await this.campaignOnChain.getPublishInfo(
      campaign.address
    );

    appLogger.debug(
      `publishCampaign: rootDetails: ${JSON.stringify(
        rootDetails
      )} - publishInfo: ${JSON.stringify(publishInfo)}`
    );

    if (
      rootDetails.root !== publishInfo.status.approvedRoot &&
      rootDetails.root !== publishInfo.status.pendingRoot &&
      publishInfo.status.isProposeWindowActive
    ) {
      appLogger.debug(`publishCampaign - root: ${rootDetails.root}`);
      await this.onChainService.publishShares(
        campaign.address,
        rootDetails.root
      );

      await this.campaignRepo.setPublished(uri, true, this.timeService.now());
    } else {
      appLogger.debug(
        `publishCampaign skipped, merkle root not new: ${rootDetails.root}`
      );
    }

    /** republishing is configured when publishing if there were pending rewarded users */
    if (rootDetails.totalPending > 0) {
      if (!publishInfo.status.locked) {
        /**
         * schedule to republish when oracle clock reaches the publish start. Add a margin to make sure
         * that the onchain clock will also hold the time-based condition.
         */
        if (publishInfo.derived === undefined)
          throw new Error(
            'publish info does not include the derived parameters'
          );

        appLogger.debug(`publishCampaign - configuring republish ${uri} `);
        await this.campaignRepo.setRepublishDate(
          uri,
          publishInfo.derived.nextWindowStarts + this.config.republishTimeMargin
        );
      }
    }
  }

  isPendingExecution(uri: string, now: number): Promise<boolean> {
    return this.campaignRepo.isPendingExecution(uri, now);
  }

  isPendingPublishing(uri: string): Promise<boolean> {
    return this.campaignRepo.isPendingPublishing(uri);
  }

  async computeRoot(
    campaign: Campaign,
    save: boolean = true
  ): Promise<RootComputation> {
    if (!campaign.registered) {
      throw new Error(`campaign ${campaign.uri} not registered`);
    }

    if (!campaign.executed) {
      throw new Error(`campaign ${campaign.uri} not executed`);
    }

    /** reentrancy protection - don't recompute if already computing for this campaign (
     * root computation may take minutes) */
    if (this.computingRoot.has(campaign.uri)) {
      return this.computingRoot.get(campaign.uri);
    }

    const compute = (async (): Promise<RootComputation> => {
      const now = this.timeService.now();
      const nRewarded = await this.countRewards(campaign.uri);
      const rewards = await this.getRewardsToAddresses(campaign.uri);

      if (rewards.size === 0) {
        return {
          root: ZERO_BYTES32,
          totalRewarded: nRewarded,
          totalInRoot: 0,
          totalPending: nRewarded,
        };
      }

      const balances: Balances = new Map();
      rewards.forEach((reward, address) => {
        balances.set(address, reward.amount);
      });

      const tree = new BalanceTree(balances);
      const root = tree.getHexRoot();

      /** compute proofs */
      const leafs = Array.from(rewards.entries()).map(
        ([address, reward]): Prisma.BalanceLeafCreateManyRootInput => {
          const proof = tree.getProof(address, reward.amount);
          return {
            account: reward.account,
            address,
            balance: reward.amount.toString(),
            proof,
          };
        }
      );

      if (save) {
        /**
         * only save new roots if caller intended to save when computing and
         * if the new root is different from the latest one
         */
        const latest = await this.getLatestRoot(campaign.uri);
        if (latest === null || latest.root !== root) {
          await this.campaignRepo.addRoot(
            campaign.uri,
            root,
            leafs,
            now,
            latest === null ? 0 : latest.order + 1
          );
        }
      }

      return {
        root,
        totalRewarded: nRewarded,
        totalInRoot: rewards.size,
        totalPending: nRewarded - rewards.size,
      };
    })();

    this.computingRoot.set(campaign.uri, compute);
    const root = await compute;
    this.computingRoot.delete(campaign.uri);

    return root;
  }

  async getRoot(root: string): Promise<RootDetails> {
    return this.campaignRepo.getRoot(root);
  }

  async getLatestRoot(uri: string): Promise<CampaignRoot> {
    return this.campaignRepo.getLatestRoot(uri);
  }

  async getRewards(uri: string): Promise<Balances> {
    return this.campaignRepo.getRewards(uri);
  }

  async countRewards(uri: string): Promise<number> {
    return this.campaignRepo.countRewards(uri);
  }

  /** considers only extensions to the previous root */
  async getRewardsToAddresses(uri: string): Promise<RewardsToAddresses> {
    const latest = await this.campaignRepo.getLatestRootAndLeafs(uri);
    const extension = await this.campaignRepo.getNewRewardsToAddresses(
      uri,
      latest?.order
    );

    const rewardsToAddresses: RewardsToAddresses = new Map();

    /** filtering existing users here */
    const usersInTree = new Map<string, string>();

    if (latest !== null) {
      /** the tree starts with its previous version */
      latest.balances.forEach((leaf) => {
        usersInTree.set(leaf.account, leaf.address);
        rewardsToAddresses.set(leaf.address, {
          account: leaf.account,
          amount: ethers.BigNumber.from(leaf.balance),
        });
      });
    }

    /** the new values are then added as long as they are not yet present (in terms of account) */
    extension.forEach((reward, address) => {
      const addressInTree = usersInTree.get(reward.account);
      if (addressInTree !== undefined) {
        /** user should not be already in the tree (only new users can be appended) */
        /** TODO: getNewRewardsToAddresses should do the filtering, but we currently do it here
         * for simplicity */
        // throw new Error();
      } else {
        /** new users are added in addition to the latests */
        rewardsToAddresses.set(address, {
          account: reward.account,
          amount: reward.amount,
        });
      }
    });

    return rewardsToAddresses;
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

  async register(
    uri: string,
    details: CampaignCreateDetails,
    by: string
  ): Promise<void> {
    await this.campaignRepo.setDetails(uri, details, by);
  }

  setExecuted(uri: string): Promise<void> {
    return this.campaignRepo.setExecuted(uri, true);
  }

  findPendingExecution(time: number): Promise<string[]> {
    return this.campaignRepo.findPendingExecution(time);
  }

  findPendingRepublish(time: number): Promise<string[]> {
    return this.campaignRepo.findPendingRepublish(time);
  }

  deleteAll(): Promise<void> {
    return this.campaignRepo.deleteAll();
  }

  list(user?: string): Promise<Campaign[]> {
    return this.campaignRepo.list(user);
  }
}
