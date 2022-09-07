import {
  CampaignFundersRead,
  campaignProvider,
  Page,
} from '@dao-strategies/core';
import { providers } from 'ethers';

import { config } from '../../config';
import { appLogger } from '../../logger';
import { IndexRepository } from '../../repositories/IndexRepository';
import { CampaignService } from '../CampaignService';

const DEBUG = true;

export class IndexingService {
  private updating: Promise<void> | undefined;

  constructor(
    protected indexRepo: IndexRepository,
    protected campaign: CampaignService,
    protected provider: providers.Provider
  ) {}

  async updateCampaignIndex(
    uri: string,
    address: string,
    fromBlock: number,
    toBlock: number
  ): Promise<void> {
    /** reentrancy protection */
    if (this.updating !== undefined) {
      if (DEBUG)
        appLogger.debug(`IndexingService updateCampaignIndex() reentered`);
      return this.updating;
    }

    const update = async (address: string): Promise<void> => {
      if (DEBUG)
        appLogger.debug(`IndexingService - updateCampaignIndex() - update`);
      const campaign = campaignProvider(address, this.provider);

      /** all Fund events */
      const filter = campaign.filters.Fund(null, null, null);
      const events = await campaign.queryFilter(filter, fromBlock, toBlock);

      if (DEBUG)
        appLogger.debug(`IndexingService - events found: ${events.length}`);

      /** add one entry in the DB for each FundEvent */
      await Promise.all(
        events
          .map(async (event) => {
            const { hash } = await event.getTransaction();
            if (DEBUG)
              appLogger.debug(
                `IndexingService - addFundEvent funder: ${event.args.provider}, hash: ${hash}`
              );
            return this.indexRepo.addFundEvent({
              campaignId: uri,
              amount: event.args.amount.toString(),
              blockNumber: event.blockNumber,
              funder: event.args.provider,
              hash: hash,
            });
          })
          .concat(this.indexRepo.addIndexMark(uri, toBlock))
      );
    };

    this.updating = update(address);

    if (DEBUG) appLogger.debug(`IndexingService - runnig update`);
    this.updating
      .then(() => (this.updating = undefined))
      .catch((e) => (this.updating = undefined));
    if (DEBUG) appLogger.debug(`IndexingService - done`);

    this.updating = undefined;
  }

  async checkUpdate(uri: string): Promise<void> {
    if (DEBUG) appLogger.debug(`IndexingService - checkUpdate() ${uri}`);
    const campaign = await this.campaign.get(uri);

    const indexedBlock = await this.indexRepo.getBlockOf(campaign.address);

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
        `IndexingService - indexedBlock: ${indexedBlock}, latestBlock: ${latestBlock}`
      );
    if (latestBlock - indexedBlock >= config.updatePeriod) {
      await this.updateCampaignIndex(
        campaign.uri,
        campaign.address,
        indexedBlock,
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
