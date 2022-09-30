import {
  CampaignOnchainDetails,
  ChainsDetails,
  CampaignClaimInfo,
  TreeClaimInfo,
  campaignProvider,
  TokenBalance,
  Typechain,
  PublishInfo,
  getCampaignPublishInfo,
  bigNumberToNumber,
  erc20Provider,
  Asset,
} from '@dao-strategies/core';
import { Campaign } from '@prisma/client';
import { BigNumber } from 'ethers';
import { ChainProvider, ChainProviders } from '../../types';

import { awaitWithTimeout } from '../../utils/utils';
import { CampaignService } from '../CampaignService';
import { PriceService } from '../PriceService';

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export class ReadDataService {
  constructor(
    protected campaignService: CampaignService,
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

  async getBlockNumber(chainId: number): Promise<number> {
    /* eslint-disable */
    /**
     * Something is weird here. the Provider interface in ethers
     * exposes an asyn method to the the blocknumber but it
     * is not found and runtime. While the blocknumber is there
     * to be directly read
     */
    const anyProvider = this.providers.get(chainId).provider as any;
    const blockNumber =
      anyProvider.blockNumber !== undefined
        ? (anyProvider.blockNumber as number)
        : await anyProvider.getBlockNumber();
    return blockNumber;
    /* eslint-enable */
  }

  async getCampaignDetails(
    address: string
  ): Promise<CampaignOnchainDetails | null> {
    if (!address) return null;
    const campaign = await this.campaignService.getFromAddress(address);

    const campaignContract = campaignProvider(
      campaign.address,
      this.getProvider(campaign.chainId).provider
    );

    const { balances } = await this.getCampaignBalances(campaign);
    const raised = await this.getCampaignRaised(campaign, campaignContract);
    const publishInfo = await this.getPublishInfo(
      campaign.address,
      campaign.chainId
    );

    const root =
      publishInfo.status.validRoot !== ZERO_BYTES32
        ? await this.campaignService.getRoot(publishInfo.status.validRoot)
        : undefined;

    return { balances, raised, publishInfo, root };
  }

  async getCampaignBalances(
    campaign: Campaign
  ): Promise<{ balances: TokenBalance[]; blockNumber: number }> {
    const assets = ChainsDetails.chainAssets(campaign.chainId);

    const tokens = await Promise.all(
      assets.map(async (asset): Promise<TokenBalance> => {
        let getBalance: Promise<BigNumber>;
        const provider = this.getProvider(campaign.chainId).provider;
        if (!ChainsDetails.isNative(asset)) {
          const token = erc20Provider(asset.address, provider);
          getBalance = token.balanceOf(campaign.address);
        } else {
          getBalance = provider.getBalance(campaign.address);
        }
        /* eslint-disable */
        const balance = await awaitWithTimeout<BigNumber>(
          getBalance,
          2000,
          new Error('Timeout getting balance')
        );
        const price = await this.priceOf(campaign.chainId, asset.address);
        /* eslint-enable */
        return {
          ...asset,
          balance: balance.toString(),
          price,
        };
      })
    );

    const custom = await this.getCustomBalances(
      campaign.customAssets,
      campaign.chainId,
      campaign.address
    );

    const blockNumber = await this.getBlockNumber(campaign.chainId);

    return { balances: tokens.concat(custom), blockNumber };
  }

  async getCampaignRaised(
    campaign: Campaign,
    campaignContract: Typechain.Campaign
  ): Promise<TokenBalance[]> {
    const assets = ChainsDetails.chainAssets(campaign.chainId);
    const custom = await this.getCustomAssets(
      campaign.customAssets,
      campaign.chainId
    );

    const raised = await Promise.all(
      assets.concat(custom).map(async (asset): Promise<TokenBalance> => {
        const raised = await campaignContract.totalReceived(asset.address);
        const price = await this.priceOf(campaign.chainId, asset.address);

        return {
          ...asset,
          balance: raised.toString(),
          price,
        };
      })
    );

    return raised;
  }

  async getCustomAssets(
    customAssets: string[],
    chainId: number
  ): Promise<Asset[]> {
    return await Promise.all(
      customAssets.map(async (assetAddress): Promise<Asset> => {
        const token = erc20Provider(
          assetAddress,
          this.getProvider(chainId).provider
        );

        //
        const decimals = await token.decimals();
        const symbol = await token.symbol();

        return {
          address: assetAddress,
          decimals: decimals,
          id: assetAddress,
          name: symbol,
          // balance: balance.toString(),
        };
      })
    );
  }

  /** append the balance of the custom assets of a given address */
  async getCustomBalances(
    customAssets: string[],
    chainId: number,
    address: string
  ): Promise<TokenBalance[]> {
    const assets = await this.getCustomAssets(customAssets, chainId);

    return Promise.all(
      assets.map(async (asset) => {
        const token = erc20Provider(
          asset.address,
          this.getProvider(chainId).provider
        );
        const balance = await token.balanceOf(address);
        return {
          ...asset,
          balance: balance.toString(),
        };
      })
    );
  }

  async getCustomRewardsAvailable(
    customAssets: string[],
    chainId: number,
    address: string,
    shares: string,
    campaignContract: Typechain.Campaign
  ): Promise<TokenBalance[]> {
    const assets = await this.getCustomAssets(customAssets, chainId);

    return Promise.all(
      assets.map(async (asset) => {
        const amount = await campaignContract.rewardsAvailableToClaimer(
          address,
          shares,
          asset.address
        );
        return {
          ...asset,
          balance: amount.toString(),
        };
      })
    );
  }

  /** get the shares (and fill the assets) for a given merkle root of a given campaign */
  async getTreeClaimInfo(
    uri: string,
    root: string,
    address: string,
    campaignContract: Typechain.Campaign,
    chainId: number,
    customAssets: string[],
    verify: boolean = false
  ): Promise<TreeClaimInfo | undefined> {
    /** if there should be an entry in the root for this addres,
     * read the proof for this address and balance */
    const leaf = await this.campaignService.getBalanceLeaf(uri, root, address);

    /** is this an error? */
    if (leaf == null) return undefined;

    /** protection: check that the proof is valid */
    if (verify) {
      await campaignContract.verifyShares(address, leaf.balance, leaf.proof);
    }

    const assets = ChainsDetails.chainAssets(chainId);

    const tokens = await Promise.all(
      assets.map(async (asset): Promise<TokenBalance> => {
        const amount = await campaignContract.rewardsAvailableToClaimer(
          address,
          leaf.balance,
          asset.address
        );
        const price = await this.priceOf(chainId, asset.address);
        return {
          ...asset,
          balance: amount.toString(),
          price: price,
        };
      })
    );

    const custom = await this.getCustomRewardsAvailable(
      customAssets,
      chainId,
      address,
      leaf.balance,
      campaignContract
    );

    return {
      root,
      address,
      present: true,
      shares: leaf.balance.toString(),
      assets: tokens.concat(custom),
      proof: leaf.proof,
    };
  }

  async getClaimInfo(
    campaignAddress: string,
    address: string
  ): Promise<CampaignClaimInfo | undefined> {
    const campaign = await this.campaignService.getFromAddress(campaignAddress);

    /** read the root details (including the tree) of the current campaign root (use the root
     * from the contract since maybe there is a recent one in the DB that has not been published) */
    const campaignContract = campaignProvider(
      campaign.address,
      this.getProvider(campaign.chainId).provider
    );

    const currentRoot = await campaignContract.getValidRoot();

    const currentClaim = await this.getTreeClaimInfo(
      campaign.uri,
      currentRoot,
      address,
      campaignContract,
      campaign.chainId,
      campaign.customAssets,
      true
    );

    const isRootActive = await campaignContract.isPendingActive();
    const activationTime = await campaignContract.activationTime();

    let pendingClaim: TreeClaimInfo | undefined = undefined;
    if (!isRootActive) {
      const pendingRoot = await campaignContract.pendingMerkleRoot();
      if (pendingRoot !== currentRoot) {
        pendingClaim = await this.getTreeClaimInfo(
          campaign.uri,
          pendingRoot,
          address,
          campaignContract,
          campaign.chainId,
          campaign.customAssets
        );
      }
    }

    return {
      executed: campaign.executed,
      published: campaign.published,
      current: currentClaim,
      pending: pendingClaim,
      activationTime: bigNumberToNumber(activationTime),
    };
  }

  async priceOf(chainId: number, address: string): Promise<number | undefined> {
    return this.price.priceOf(chainId, address);
  }

  async getPublishInfo(address: string, chainId: number): Promise<PublishInfo> {
    return getCampaignPublishInfo(
      this.getProvider(chainId).provider,
      chainId,
      address
    );
  }
}
