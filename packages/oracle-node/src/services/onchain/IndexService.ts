import {
  CampaignFundersRead,
  campaignProvider,
  ChainsDetails,
  Page,
  TokenBalance,
} from '@dao-strategies/core';
import { FundEvent } from '@prisma/client';
import { providers } from 'ethers';

import { config } from '../../config';
import { appLogger } from '../../logger';
import { CampaignRepository } from '../../repositories/CampaignRepository';
import { IndexRepository } from '../../repositories/IndexRepository';
import { CampaignService } from '../CampaignService';
import { PriceService } from '../PriceService';
import { ReadDataService } from './ReadDataService';

const DEBUG = true;

export class IndexingService {
  private updating: Promise<string[]> | undefined;

  constructor(
    protected indexRepo: IndexRepository,
    protected campaignRepo: CampaignRepository,
    protected campaign: CampaignService,
    protected readDataService: ReadDataService,
    protected price: PriceService,
    protected provider: providers.Provider
  ) {}

  async updateFundersIndex(
    uri: string,
    address: string,
    fromBlock: number,
    toBlock: number
  ): Promise<void> {
    /** reentrancy protection */
    if (this.updating !== undefined) {
      if (DEBUG)
        appLogger.debug(`IndexingService updateCampaignIndex() reentered`);
      return new Promise((resolve, reject) => {
        this.updating.then((_) => resolve()).catch((e) => reject(e));
      });
    }

    /**
     * We will first get all the new events fromBlock and toBlock, store them
     * in the FundEvents table and then trigger an update to the CampaignFunders
     * table, which will cache all the funding events of each user and store
     * their total USD value
     */
    const update = async (address: string): Promise<string[]> => {
      if (DEBUG)
        appLogger.debug(`IndexingService - updateCampaignIndex() - update`);
      const campaign = campaignProvider(address, this.provider);

      /** all Fund events */
      const filter = campaign.filters.Fund(null, null, null);
      const events = await campaign.queryFilter(filter, fromBlock, toBlock);

      if (DEBUG)
        appLogger.debug(`IndexingService - events found: ${events.length}`);

      /** add one entry in the DB for each FundEvent */
      const funders = new Set<string>();
      await Promise.all(
        events
          .map(async (event) => {
            const { hash } = await event.getTransaction();
            if (DEBUG)
              appLogger.debug(
                `IndexingService - addFundEvent funder: ${event.args.provider}, hash: ${hash}`
              );

            const address = event.args.provider.toLocaleLowerCase();
            funders.add(address);

            return this.indexRepo.addFundEvent({
              campaign: { connect: { uri } },
              amount: event.args.amount.toString(),
              blockNumber: event.blockNumber,
              funder: {
                connectOrCreate: {
                  where: {
                    campaignId_address: {
                      campaignId: uri,
                      address,
                    },
                  },
                  create: {
                    campaign: { connect: { uri } },
                    address,
                    value: 0,
                  },
                },
              },
              asset: event.args.asset,
              hash: hash,
            });
          })
          .concat(this.indexRepo.setFundersBlock(uri, toBlock))
      );

      /** unique funders */

      return Array.from(funders);
    };

    this.updating = update(address);

    if (DEBUG) appLogger.debug(`IndexingService - runnig update`);

    try {
      const funders = await this.updating;
      if (funders.length > 0) {
        /** update the cached CampaignFunder table if new funders were found */
        await this.updateTotalContributions(uri, funders);
      }
      this.updating = undefined;
    } catch (e) {
      this.updating = undefined;
      throw new Error(`Error updating founders ${e}`);
    }
  }

  /** update the cached CampaignFundersTable (one funder can have many fund events) */
  async updateTotalContributions(
    uri: string,
    addresses?: string[]
  ): Promise<void> {
    const chainId = await this.campaign.getChainId(uri);

    /** get FundEvents (all historic ones)*/
    const fundEvents = await this.indexRepo.getFundEvents(uri, addresses);
    const funders = new Map<string, FundEvent[]>();

    /** joing fund events of the same funder */
    fundEvents.forEach((event) => {
      const funder = event.funderAddress;
      const current = funders.get(funder) || [];
      funders.set(funder, current.concat([event]));
    });

    Array.from(funders.entries()).map(async ([funder, events]) => {
      const assets = await Promise.all(
        events.map(async (event): Promise<TokenBalance> => {
          const asset = ChainsDetails.assetOfAddress(chainId, event.asset);
          const price = await this.price.priceOf(chainId, asset.address);
          return { ...asset, balance: event.amount, price };
        })
      );

      const totalValue = ChainsDetails.valueOfAssets(assets);
      await this.indexRepo.upsertFunder({
        campaignId: uri,
        address: funder,
        value: totalValue,
      });
    });
  }

  async updateTvlIndex(uri: string, atBlock: number): Promise<void> {
    // TODO, use multicall to read balances at a given block number, right now it's not consistent.
    const campaign = await this.campaign.get(uri);
    const balances = await this.readDataService.getCampaignBalances(campaign);
    const value = ChainsDetails.valueOfAssets(balances.balances);

    await Promise.all([
      this.campaignRepo.setCampaignValueLocked(uri, value),
      this.indexRepo.setFundersBlock(uri, balances.blockNumber),
    ]);
  }

  async checkFundersUpdate(uri: string): Promise<void> {
    if (DEBUG) appLogger.debug(`IndexingService - checkUpdate() ${uri}`);
    const campaign = await this.campaign.get(uri);

    const fundersBlock = await this.indexRepo.getBlockOfFunders(uri);
    const latestBlock = await this.readDataService.getBlockNumber();

    if (DEBUG)
      appLogger.debug(
        `IndexingService - fundersBlock: ${fundersBlock}, latestBlock: ${latestBlock}`
      );

    if (latestBlock - fundersBlock >= config.fundersUpdatePeriod) {
      await this.updateFundersIndex(
        campaign.uri,
        campaign.address,
        fundersBlock,
        latestBlock
      );
    }
  }

  async checkTvlUpdate(address: string): Promise<void> {
    if (DEBUG) appLogger.debug(`IndexingService - checkUpdate() ${address}`);
    const campaign = await this.campaign.getFromAddress(address);

    const tvlBlock = await this.indexRepo.getBlockOfFunders(campaign.uri);
    const latestBlock = await this.readDataService.getBlockNumber();

    if (DEBUG)
      appLogger.debug(
        `IndexingService - tvlBlock: ${tvlBlock}, latestBlock: ${latestBlock}`
      );

    if (latestBlock - tvlBlock >= config.fundersUpdatePeriod) {
      await this.updateTvlIndex(campaign.uri, tvlBlock);
    }
  }

  async getCampaignFunders(
    uri: string,
    page: Page = { number: 0, perPage: 10 }
  ): Promise<CampaignFundersRead> {
    /** check update index everytime someone ask for the funders */
    await this.checkFundersUpdate(uri);

    if (DEBUG) appLogger.debug(`IndexingService - getCampaignFunders() ${uri}`);
    const funders = await this.indexRepo.getFunders(uri, page);

    if (DEBUG)
      appLogger.debug(
        `IndexingService - getCampaignFunders(): funders: ${JSON.stringify(
          funders.funders.map((funder) => funder.funder)
        )}`
      );

    return funders;
  }
}
