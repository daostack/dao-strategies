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
import { IndexRepository } from '../../repositories/IndexRepository';
import { CampaignService } from '../CampaignService';
import { PriceService } from '../PriceService';

const DEBUG = true;

export class IndexingService {
  private updating: Promise<string[]> | undefined;

  constructor(
    protected indexRepo: IndexRepository,
    protected campaign: CampaignService,
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
          .concat(this.indexRepo.addIndexMark(uri, toBlock))
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

  async updateTvlIndex(): Promise<void> {
    const balances = await this.
  }

  async checkUpdate(uri: string): Promise<void> {
    if (DEBUG) appLogger.debug(`IndexingService - checkUpdate() ${uri}`);
    const campaign = await this.campaign.get(uri);

    const fundersBlock = await this.indexRepo.getBlockOfFunders(uri);
    const tvlBlock = await this.indexRepo.getBlockOfFunders(uri);

    /**
     * Ups! this.provider <providers.Provider> is not inline with ethers.providers.JsonRpcProvider
     * Manually check for property existence...
     */
    /* eslint-disable */
    const anyProvider = this.provider as any;
    const latestBlock =
      anyProvider.blockNumber !== undefined
        ? (anyProvider.blockNumber as number)
        : await this.provider.getBlockNumber();
    /* eslint-enable */

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

    if (DEBUG)
      appLogger.debug(
        `IndexingService - fundersBlock: ${tvlBlock}, latestBlock: ${latestBlock}`
      );

    if (latestBlock - tvlBlock >= config.fundersUpdatePeriod) {
      await this.updateTvlIndex(
        campaign.uri,
        campaign.address,
        tvlBlock,
        latestBlock
      );
    }
  }

  async getCampaignFunders(
    uri: string,
    page: Page = { number: 0, perPage: 10 }
  ): Promise<CampaignFundersRead> {
    /** check update index everytime someone ask for the funders */
    await this.checkUpdate(uri);

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
