import {
  CampaignOnchainDetails,
  ChainId,
  ChainsDetails,
} from '@dao-strategies/core';
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
    const assets = ChainsDetails.chainAssets(
      this.provider.network.chainId.toString() as ChainId
    );

    const assetsKeys = Object.keys(assets);

    const balances = await Promise.all(
      assetsKeys.map(
        async (
          key
        ): Promise<{
          key: string;
          address: string;
          balance: string;
        }> => {
          const asset = assets[key];
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
            key,
            address: asset.address,
            balance: balance.toString(),
          };
        }
      )
    );

    /** convert arry to object with keys */
    const tokens = {};
    balances.forEach((balance) => {
      tokens[balance.key] = {
        address: balance.address,
        balance: balance.balance,
      };
    });

    return { tokens };
  }
}
