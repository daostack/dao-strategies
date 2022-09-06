import {
  CampaignFundersRead,
  campaignProvider,
  Page,
} from '@dao-strategies/core';
import { providers } from 'ethers';

import { config } from '../../config';
import { IndexRepository } from '../../repositories/IndexRepository';
import { CampaignService } from '../CampaignService';

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
      return this.updating;
    }

    const update = async (address: string): Promise<void> => {
      const campaign = campaignProvider(address, this.provider);

      /** all Fund events */
      const filter = campaign.filters.Fund(null, null, null);
      const events = await campaign.queryFilter(filter, fromBlock, toBlock);

      /** add one entry in the DB for each FundEvent */
      await Promise.all(
        events.map(async (event) => {
          const { hash } = await event.getTransaction();
          return this.indexRepo.addFundEvent({
            campaignId: uri,
            amount: event.args.amount.toString(),
            blockNumber: event.blockNumber,
            funder: event.args.provider,
            hash: hash,
          });
        })
      );
    };

    this.updating = update(address);
    await this.updating;
    this.updating = undefined;
  }

  async checkUpdate(uri: string): Promise<void> {
    const campaign = await this.campaign.get(uri);

    const indexedBlock = await this.indexRepo.getBlockOf(campaign.address);
    const latestBlock = await this.provider.getBlockNumber();

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
    address: string,
    page: Page = { number: 0, perPage: 10 }
  ): Promise<CampaignFundersRead> {
    const campaign = await this.campaign.getFromAddress(address);

    const funders = await this.indexRepo.getFunders(campaign.uri, page);

    /** async check update index everytime someone ask for the funders 
    (so we don't try to index inactive campaigns) */
    void this.checkUpdate(campaign.uri);

    return funders;
  }
}
