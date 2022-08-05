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
import { Campaign, Share } from '@prisma/client';
import { BigNumber, ethers, providers } from 'ethers';

import { CampaignService } from './CampaignService';
import { PriceService } from './PriceService';

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export class CampaignOnChainService {
  readonly provider: providers.JsonRpcProvider;

  constructor(
    protected campaignService: CampaignService,
    protected price: PriceService,
    _provider?: providers.JsonRpcProvider
  ) {
    this.provider =
      _provider || new providers.JsonRpcProvider(process.env.JSON_RPC_URL);
  }

  async getCampaignDetails(address: string): Promise<CampaignOnchainDetails> {
    const campaign = await this.campaignService.getFromAddress(address);
    const campaignContract = campaignProvider(campaign.address, this.provider);

    const balances = await this.getCampaignBalances(campaign);
    const raised = await this.getCampaignRaised(campaign, campaignContract);
    const publishInfo = await this.getPublishInfo(campaign.address);
    const root =
      publishInfo.status.validRoot !== ZERO_BYTES32
        ? await this.campaignService.getRoot(publishInfo.status.validRoot)
        : undefined;

    return { balances, raised, publishInfo, root };
  }

  async getCampaignBalances(campaign: Campaign): Promise<TokenBalance[]> {
    const assets = ChainsDetails.chainAssets(campaign.chainId);

    const tokens = await Promise.all(
      assets.map(async (asset): Promise<TokenBalance> => {
        let getBalance;

        if (!ChainsDetails.isNative(asset)) {
          const token = erc20Provider(asset.address, this.provider);
          getBalance = token.balanceOf(campaign.address);
        } else {
          getBalance = this.provider.getBalance(campaign.address);
        }
        /* eslint-disable */
        const balance = (await getBalance) as BigNumber;
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
      campaign.address
    );

    return tokens.concat(custom);
  }

  async getCampaignRaised(
    campaign: Campaign,
    campaignContract: Typechain.Campaign
  ): Promise<TokenBalance[]> {
    const assets = ChainsDetails.chainAssets(campaign.chainId);
    const custom = await this.getCustomAssets(campaign.customAssets);

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

  async getCustomAssets(customAssets: string[]): Promise<Asset[]> {
    return await Promise.all(
      customAssets.map(async (assetAddress): Promise<Asset> => {
        const token = erc20Provider(assetAddress, this.provider);

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
    address: string
  ): Promise<TokenBalance[]> {
    const assets = await this.getCustomAssets(customAssets);

    return Promise.all(
      assets.map(async (asset) => {
        const token = erc20Provider(asset.address, this.provider);
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
    address: string,
    shares: string,
    campaignContract: Typechain.Campaign
  ): Promise<TokenBalance[]> {
    const assets = await this.getCustomAssets(customAssets);

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
    share: Share,
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

    /** protection: the shares in the root should not be other than the shares computed for this address */
    if (
      !ethers.BigNumber.from(share.amount.toString()).eq(
        ethers.BigNumber.from(leaf.balance)
      )
    ) {
      throw new Error(
        `Unexpected shares for account ${address}. Share was ${share.amount} but leaf is ${leaf.balance}`
      );
    }

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

    /** get the shares of the address () */
    const shares = await this.campaignService.getSharesOfAddress(
      campaign.uri,
      address
    );

    /** if there is not shares, then there should not be any entry in the root */
    if (shares == null) return undefined;

    /**
     * if there are shares to this address is because it is already a verified
     * address of a social account. Accordingly this address should be in the
     * merkle root of that campaign
     */

    /** read the root details (including the tree) of the current campaign root (use the root
     * from the contract since maybe there is a recent one in the DB that has not been published) */
    const campaignContract = campaignProvider(campaign.address, this.provider);

    const currentRoot = await campaignContract.getValidRoot();

    const currentClaim = await this.getTreeClaimInfo(
      campaign.uri,
      currentRoot,
      address,
      shares,
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
          shares,
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

  async getPublishInfo(address: string): Promise<PublishInfo> {
    return getCampaignPublishInfo(this.provider, address);
  }
}
