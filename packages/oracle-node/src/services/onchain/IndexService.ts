import { providers } from 'ethers';
import { campaignProvider } from '@dao-strategies/core';
import { IndexRepository } from '../../repositories/IndexRepository';
import { CampaignService } from '../CampaignService';

export class IndexingService {
  readonly provider: providers.JsonRpcProvider;

  private updating: Promise<void> | undefined;

  constructor(
    protected indexRepo: IndexRepository,
    protected campaign: CampaignService,
    _provider?: providers.JsonRpcProvider
  ) {
    this.provider =
      _provider || new providers.JsonRpcProvider(process.env.JSON_RPC_URL);
  }

  async updateCampaignIndex(uri: string): Promise<void> {
    /** reentrancy protection */
    if (this.updating !== undefined) {
      return this.updating;
    }

    const campaign = await this.campaign.get(uri);

    const update = async (address: string): Promise<void> => {
      const campaign = campaignProvider(address, this.provider);
      const indexedBlock = await this.indexRepo.getBlockOf(address);
      const latestBlock = await this.provider.getBlockNumber();

      if (latestBlock > indexedBlock) {
        /** all Fund events */
        const filter = campaign.filters.Fund(null, null, null);
        const events = await campaign.queryFilter(
          filter,
          indexedBlock,
          latestBlock
        );

        /** add one entry in the DB for each FundEvent */
        await Promise.all(
          events.map(async (event) => {
            return this.indexRepo.addFundEvent({
              uri,
              amount: event.args.amount.toString(),
              blockNumber: event.blockNumber,
              funder: event.args.provider,
            });
          })
        );
      }
    };

    this.updating = update(campaign.address);
    await this.updating;
    this.updating = undefined;
  }
}
