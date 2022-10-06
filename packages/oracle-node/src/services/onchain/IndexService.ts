import {
  bigIntToNumber,
  CampaignFunder,
  CampaignFundersRead,
  campaignProvider,
  ChainsDetails,
  FundEventRead,
  Page,
  TokenBalance,
} from '@dao-strategies/core';
import { FundEvent, Prisma } from '@prisma/client';
import { BigNumber } from 'ethers/lib/ethers';

import { config } from '../../config';
import { appLogger } from '../../logger';
import { CampaignRepository } from '../../repositories/CampaignRepository';
import { IndexRepository } from '../../repositories/IndexRepository';
import { ChainProvider, ChainProviders } from '../../types';
import { CampaignService } from '../CampaignService';
import { PriceService } from '../PriceService';

import { ReadDataService } from './ReadDataService';

const DEBUG = false;

export class IndexingService {
  private updating: Promise<string[]> | undefined;

  constructor(
    protected indexRepo: IndexRepository,
    protected campaignRepo: CampaignRepository,
    protected campaign: CampaignService,
    protected readDataService: ReadDataService,
    protected price: PriceService,
    protected providers: ChainProviders
  ) {}

  getProvider(chainId: number): ChainProvider {
    const provider = this.providers.get(chainId);
    if (!provider) {
      throw new Error(`provider not found ${chainId}`);
    }
    return provider;
  }

  async updateFundersIndex(
    uri: string,
    address: string,
    chainId: number,
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
    const update = async (campaignAddress: string): Promise<string[]> => {
      if (DEBUG)
        appLogger.debug(`IndexingService - updateCampaignIndex() - update`);
      const campaign = campaignProvider(
        campaignAddress,
        this.getProvider(chainId).provider
      );

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
            const { timestamp } = await event.getBlock();

            if (DEBUG)
              appLogger.debug(
                `IndexingService - addFundEvent funder: ${event.args.provider}, hash: ${hash}`
              );

            const funderAddress = event.args.provider.toLocaleLowerCase();
            funders.add(funderAddress);

            return this.indexRepo.addFundEvent({
              campaign: { connect: { uri } },
              amount: event.args.amount.toString(),
              blockNumber: event.blockNumber,
              timestamp,
              funder: {
                connectOrCreate: {
                  where: {
                    campaignId_address: {
                      campaignId: uri,
                      address: funderAddress,
                    },
                  },
                  create: {
                    campaign: { connect: { uri } },
                    address: funderAddress,
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

      if (DEBUG)
        appLogger.debug(
          `IndexingService - Funders read ${JSON.stringify(funders)}`
        );
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
    appLogger.debug(
      `IndexingService - updateTotalContributions ${JSON.stringify(addresses)}`
    );
    const chainId = await this.campaign.getChainId(uri);

    /** get FundEvents (all historic ones)*/
    const fundEvents = await this.indexRepo.getFundEvents(uri, addresses);
    const funders = new Map<string, FundEvent[]>();

    appLogger.debug(
      `IndexingService - fundEvents ${JSON.stringify(fundEvents)}`
    );

    /** joing fund events of the same funder */
    fundEvents.forEach((event) => {
      const funder = event.funderAddress;
      const current = funders.get(funder) || [];
      funders.set(funder, current.concat([event]));
    });

    await Promise.all(
      Array.from(funders.entries()).map(async ([funder, events]) => {
        const assets = await Promise.all(
          events.map(async (event): Promise<TokenBalance> => {
            return this.readDataService.tokenBalance(
              chainId,
              event.asset,
              event.amount
            );
          })
        );

        const totalValue = ChainsDetails.valueOfAssets(assets);

        const newFunder: Prisma.CampaignFunderUncheckedCreateInput = {
          campaignId: uri,
          address: funder,
          value: totalValue,
        };
        if (DEBUG)
          appLogger.debug(`IndexService adding: ${JSON.stringify(newFunder)}`);

        await this.indexRepo.upsertFunder(newFunder);
      })
    );
  }

  async updateTvlIndex(uri: string, atBlock: number): Promise<void> {
    // TODO, use multicall to read balances at a given block number, right now it's not consistent.
    const campaign = await this.campaign.get(uri);
    const balances = await this.readDataService.getCampaignBalances(campaign);
    const value = ChainsDetails.valueOfAssets(balances.balances);

    await Promise.all([
      this.campaignRepo.setCampaignValueLocked(uri, value),
      this.indexRepo.setTvlBlock(uri, balances.blockNumber),
    ]);
  }

  async checkFundersUpdate(uri: string, force: boolean): Promise<void> {
    if (DEBUG) appLogger.debug(`IndexingService - checkUpdate() ${uri}`);
    const campaign = await this.campaign.get(uri);

    const fundersBlock = await this.indexRepo.getBlockOfFunders(uri);
    const latestBlock = await this.readDataService.getBlockNumber(
      campaign.chainId
    );

    if (DEBUG)
      appLogger.debug(
        `IndexingService - fundersBlock: ${fundersBlock}, latestBlock: ${latestBlock}`
      );

    if (latestBlock - fundersBlock >= config.fundersUpdatePeriod || force) {
      await this.updateFundersIndex(
        campaign.uri,
        campaign.address,
        campaign.chainId,
        fundersBlock,
        latestBlock
      );
    }
  }

  async checkTvlUpdate(address: string): Promise<void> {
    if (DEBUG) appLogger.debug(`IndexingService - checkUpdate() ${address}`);
    const campaign = await this.campaign.getFromAddress(address);

    const tvlBlock = await this.indexRepo.getBlockOfFunders(campaign.uri);
    const latestBlock = await this.readDataService.getBlockNumber(
      campaign.chainId
    );

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
    page: Page = { number: 0, perPage: 10 },
    force: boolean
  ): Promise<CampaignFundersRead> {
    /** check update index everytime someone ask for the funders */
    await this.checkFundersUpdate(uri, force);

    if (DEBUG) appLogger.debug(`IndexingService - getCampaignFunders() ${uri}`);
    const funders = await this.indexRepo.getFunders(uri, page);

    if (DEBUG)
      appLogger.debug(
        `IndexingService - getCampaignFunders(): funders: ${JSON.stringify(
          funders.funders.map((funder) => funder)
        )}`
      );

    const chainId = await this.campaign.getChainId(uri);

    const fundersRead = await Promise.all(
      funders.funders.map(async (funder) => {
        /** aggregate all the funded assets of a funder */
        const funded = new Map<string, BigNumber>();
        funder.events.forEach((event) => {
          const amount = BigNumber.from(event.amount);
          const has = funded.get(event.asset);
          const cum = has ? has.add(amount) : amount;
          funded.set(event.asset, cum);
        });

        const assets = await Promise.all(
          Array.from(funded.entries()).map(([assetAddress, balance]) => {
            return this.readDataService.tokenBalance(
              chainId,
              assetAddress,
              balance.toString()
            );
          })
        );

        return {
          funder: funder.address,
          assets,
          uri,
          value: funder.value,
        };
      })
    );

    return {
      uri,
      funders: fundersRead,
      page: funders.page,
    };
  }

  async getCampaignFundEvents(
    uri: string,
    n: number,
    force: boolean
  ): Promise<FundEventRead[]> {
    await this.checkFundersUpdate(uri, force);

    const events = await this.indexRepo.getFundEventsLatest(uri, n);
    const chainId = await this.campaign.getChainId(uri);

    return Promise.all(
      events.map(async (event) => {
        const assetAddress = event.asset;

        const balance = await this.readDataService.tokenBalance(
          chainId,
          assetAddress,
          event.amount
        );

        return {
          asset: balance,
          blockNumber: bigIntToNumber(event.blockNumber),
          timestamp: bigIntToNumber(event.timestamp),
          funder: event.funderAddress,
          txHash: event.hash,
          uri,
        };
      })
    );
  }
}
