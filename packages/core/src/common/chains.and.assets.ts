import { Chain, chain } from '@wagmi/core';
import { ethers } from 'ethers';

import { BNToFloat } from '../support';
import { Asset, ChainAndAssets, TokenBalance } from '../types';

import { ContractsJson } from './contracts.json';

const ETHERSCAN_URL = 'https://etherscan.io';

/** Single source of truth for the supported chains and assets. It is imported on the
 * frontend */

const chainList: ChainAndAssets[] = [
  {
    chain: chain.localhost,
    exploreAddress: (address: string) => `${ETHERSCAN_URL}/address/${address}`,
    chainIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
    assets: [
      {
        id: 'ether',
        address: ethers.constants.AddressZero,
        name: 'Ether',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
        decimals: 18,
      },
      // {
      //   id: 'dai',
      //   address: ContractsJson.jsonOfChain().contracts.TestErc20.address,
      //   name: 'DAI',
      //   icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      //   decimals: 18,
      // },
      {
        id: 'usdc',
        address: ContractsJson.jsonOfChain().contracts.TestErc20_02
          .address as string,
        name: 'USDC',
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=022',
        decimals: 18,
      },
    ],
  },
  {
    chain: chain.mainnet,
    chainIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
    assets: [
      {
        id: 'ether',
        address: ethers.constants.AddressZero,
        name: 'Ether',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
        decimals: 18,
      },
      {
        id: 'dai',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        name: 'DAI',
        icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        decimals: 18,
      },
      {
        id: 'usdc',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USDC',
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=022',
        decimals: 6,
      },
    ],
  },
];

export enum SupportedChains {
  ethereum = 'Ethereum',
  localhost = 'Localhost',
}

export class ChainsDetails {
  static chains(): Chain[] {
    return chainList.map((chainAndAsset) => chainAndAsset.chain);
  }

  static chainOfId(id: number): ChainAndAssets | undefined {
    const entry = chainList.find((chain) => chain.chain.id === id);
    if (entry === undefined) throw new Error(`chain with id ${id} not found`);
    return entry;
  }

  static chainOfName = (name: string): ChainAndAssets | undefined => {
    const entry = chainList.find((chain) => chain.chain.name === name);
    return entry;
  };

  static chainAssets = (chainId: number): Asset[] => {
    const chain = this.chainOfId(chainId);
    return chain ? chain.assets : [];
  };

  static assetOfName = (
    chainId: number,
    assetName: string
  ): Asset | undefined => {
    const assets = this.chainAssets(chainId);
    const entry = assets.find((asset) => asset.name === assetName);
    return entry;
  };

  static assetOfAddress = (
    chainId: number,
    address: string
  ): Asset | undefined => {
    const assets = this.chainAssets(chainId);
    const entry = assets.find((asset) => asset.address === address);
    return entry;
  };

  static asset = (chainId: number, assetId: string): Asset | undefined => {
    const asset = this.chainAssets(chainId).find(
      (asset) => assetId === asset.id
    );
    return asset;
  };

  static isNative = (asset: Asset): boolean => {
    return asset.address === ethers.constants.AddressZero;
  };

  static valueOfAssets(balances: TokenBalance[]): number {
    return balances
      ? balances.reduce((sum, asset) => {
          const value = BNToFloat(
            ethers.BigNumber.from(asset.balance),
            asset.decimals
          );
          // eslint-disable-next-line no-param-reassign
          sum += asset.price ? value * asset.price : 0;
          return sum;
        }, 0)
      : 0;
  }
}
