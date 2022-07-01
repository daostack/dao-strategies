import { CampaignOnchainDetails, ChainsDetails } from '@dao-strategies/core';
import { BigNumber, Contract, providers } from 'ethers';
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
      assets.map(
        async (
          asset
        ): Promise<{
          id: string;
          address: string;
          balance: string;
          name: string;
          icon: string;
        }> => {
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
        }
      )
    );

    return { tokens };
  }
}
