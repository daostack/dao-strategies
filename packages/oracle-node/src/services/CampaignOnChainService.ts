import {
  CampaignOnchainDetails,
  ChainsDetails,
  ClaimInfo,
  campaignInstance,
  TokenBalance,
} from '@dao-strategies/core';
import { BigNumber, Contract, ethers, providers } from 'ethers';
import { CampaignService } from './CampaignService';

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
    _provider?: providers.JsonRpcProvider
  ) {
    this.provider =
      _provider || new providers.JsonRpcProvider(process.env.JSON_RPC_URL);
  }

  async getCampaignDetails(address: string): Promise<CampaignOnchainDetails> {
    const campaign = await this.campaignService.getFromAddress(address);
    const assets = ChainsDetails.chainAssets(campaign.chainId);

    const tokens = await Promise.all(
      assets.map(async (asset): Promise<TokenBalance> => {
        let getBalance;

        if (!ChainsDetails.isNative(asset)) {
          const token = new Contract(asset.address, erc20Abi, this.provider);
          getBalance = token.balanceOf(address);
        } else {
          getBalance = this.provider.getBalance(address);
        }
        /* eslint-disable */
        const balance = (await getBalance) as BigNumber;
        /* eslint-enable */
        return {
          id: asset.id,
          address: asset.address,
          balance: balance.toString(),
          name: asset.name,
          icon: asset.icon,
        };
      })
    );

    return { tokens };
  }

  async getClaimInfo(
    campaignAddress: string,
    address: string
  ): Promise<ClaimInfo | undefined> {
    const campaign = await this.campaignService.getFromAddress(campaignAddress);
    const reward = await this.campaignService.getRewardToAddress(
      campaign.uri,
      address
    );

    if (reward == null) return undefined;

    /**
     * if there is a reward to this address is because it is already a verified
     * address of a social account. Accordingly this address should be in the
     * merkle root of that campaign
     */

    /** read the root details (including the tree) of the current campaign root (use the root
     * from the contract since maybe there is a recent one in the DB that has not been published) */
    const campaignContract = campaignInstance(campaign.address, this.provider);

    const currentRoot = await campaignContract.getValidRoot();

    if (currentRoot === ZERO_BYTES32) {
      return {
        executed: false,
        present: false,
      };
    }

    /** read the proof of that root for this account and balance */
    const leaf = await this.campaignService.getBalanceLeaf(
      campaign.uri,
      currentRoot,
      address
    );

    if (leaf == null) {
      return {
        executed: true,
        present: false,
      };
    }

    /**
     * The shares in the root should be the same rewards originally computed
     * there is no reason for which the shares in the root would differ.
     */

    if (
      !ethers.BigNumber.from(reward.amount).eq(
        ethers.BigNumber.from(leaf.balance)
      )
    ) {
      throw new Error(
        `Unexpected shares for account ${address}. Reward was ${reward.amount} but leaf is ${leaf.balance}`
      );
    }

    /** check the proof is valid */
    const res = await campaignContract.verifyShares(
      address,
      leaf.balance,
      leaf.proof
    );

    console.log({ res });

    const assets = ChainsDetails.chainAssets(campaign.chainId);

    const tokens = await Promise.all(
      assets.map(async (asset): Promise<TokenBalance> => {
        const amount = await campaignContract.rewardsAvailableToClaimer(
          address,
          leaf.balance,
          asset.address
        );
        return {
          id: asset.id,
          address: asset.address,
          balance: amount.toString(),
          name: asset.name,
          icon: asset.icon,
        };
      })
    );

    return {
      executed: true,
      present: true,
      account: reward.account,
      campaignAddress: campaign.address,
      shares: reward.amount.toString(),
      assets: tokens,
    };
  }
}
