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
  RootDetails,
  bigIntToNumber,
} from '@dao-strategies/core';
import { Campaign, Reward } from '@prisma/client';
import { BigNumber, Contract, ethers, providers } from 'ethers';

import { CampaignService } from './CampaignService';
import { PriceService } from './PriceService';

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

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

    const tokens = await this.getCampaignTokens(campaign);
    const publishInfo = await this.getPublishInfo(campaign.address);
    const root = await this.campaignService.getRoot(
      publishInfo.status.validRoot
    );

    return { tokens, publishInfo, root };
  }

  async getCampaignTokens(campaign: Campaign): Promise<TokenBalance[]> {
    const assets = ChainsDetails.chainAssets(campaign.chainId);

    return await Promise.all(
      assets.map(async (asset): Promise<TokenBalance> => {
        let getBalance;

        if (!ChainsDetails.isNative(asset)) {
          const token = new Contract(asset.address, erc20Abi, this.provider);
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
  }

  /** get the shares (and fill the assets) for a given merkle root of a given campaign */
  async getTreeClaimInfo(
    uri: string,
    root: string,
    address: string,
    reward: Reward,
    campaignContract: Typechain.Campaign,
    chainId: number,
    verify: boolean = false
  ): Promise<TreeClaimInfo | undefined> {
    /** if there should be an entry in the root for this addres,
     * read the proof for this address and balance */
    const leaf = await this.campaignService.getBalanceLeaf(uri, root, address);

    /** is this an error? */
    if (leaf == null) return undefined;

    /** protection: the shares in the root should not be other than the rewards computed for this address */
    if (
      !ethers.BigNumber.from(reward.amount.toString()).eq(
        ethers.BigNumber.from(leaf.balance)
      )
    ) {
      throw new Error(
        `Unexpected shares for account ${address}. Reward was ${reward.amount} but leaf is ${leaf.balance}`
      );
    }

    /** protection: check that the proof is valid */
    if (verify) {
      const res = await campaignContract.verifyShares(
        address,
        leaf.balance,
        leaf.proof
      );
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

    return {
      root,
      address,
      present: true,
      shares: leaf.balance.toString(),
      assets: tokens,
      proof: leaf.proof,
    };
  }

  async getClaimInfo(
    campaignAddress: string,
    address: string
  ): Promise<CampaignClaimInfo | undefined> {
    const campaign = await this.campaignService.getFromAddress(campaignAddress);

    /** get the reward to the address () */
    const reward = await this.campaignService.getRewardToAddress(
      campaign.uri,
      address
    );

    /** if there is not reward, then there should not be any entry in the root */
    if (reward == null) return undefined;

    /**
     * if there is a reward to this address is because it is already a verified
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
      reward,
      campaignContract,
      campaign.chainId,
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
          reward,
          campaignContract,
          campaign.chainId
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

  async priceOf(chainId: number, address: string): Promise<number> {
    return this.price.priceOf(chainId, address);
  }

  async getPublishInfo(address: string): Promise<PublishInfo> {
    return getCampaignPublishInfo(this.provider, address);
  }
}
