import { Chain, chain } from '@wagmi/core';
import { ethers } from 'ethers';

import { BNToFloat, cmpAddresses } from '../support';
import { Asset, ChainAndAssets, TokenBalance } from '../types';

import { ContractsJson } from './contracts.json';

const ETHERSCAN_URL = 'https://etherscan.io';
const GOERLI_ETHERSCAN_URL = 'https://goerli.etherscan.io';
const POLIGON_ETHERSCAN_URL = 'https://polyscan.com';

/** Single source of truth for the supported chains and assets. It is imported on the
 * frontend */

const chainList: ChainAndAssets[] = [
  {
    chain: chain.localhost,
    exploreAddress: (address: string) => `${ETHERSCAN_URL}/address/${address}`,
    exploreTx: (hash: string) => `${ETHERSCAN_URL}/tx/${hash}`,
    exploreEns: (ens: string) => `https://app.ens.domains/name/${ens}/details`,
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
      //   address: ContractsJson.jsonOfChain(chain.localhost.id).contracts.TestErc20.address,
      //   name: 'DAI',
      //   icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      //   decimals: 18,
      // },
      {
        id: 'usdc',
        address: ContractsJson.jsonOfChain(chain.localhost.id).contracts
          .TestErc20_02.address as string,
        name: 'USDC',
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=022',
        decimals: 18,
      },
    ],
  },
  {
    chain: chain.goerli,
    exploreAddress: (address: string) =>
      `${GOERLI_ETHERSCAN_URL}/address/${address}`,
    exploreTx: (hash: string) => `${GOERLI_ETHERSCAN_URL}/tx/${hash}`,
    exploreEns: (ens: string) => `https://app.ens.domains/name/${ens}/details`,
    chainIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
    assets: [
      {
        id: 'ether',
        address: ethers.constants.AddressZero,
        name: 'Gorli-Ether',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
        decimals: 18,
      },
      {
        id: 'weenus',
        address: '0xaFF4481D10270F50f203E0763e2597776068CBc5',
        name: 'Weenus',
        icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        decimals: 18,
      },
      {
        id: 'xeeuns',
        address: '0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c',
        name: 'Xeenus',
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=022',
        decimals: 6,
      },
    ],
  },
  {
    chain: chain.polygon,
    exploreAddress: (address: string) =>
      `${POLIGON_ETHERSCAN_URL}/address/${address}`,
    exploreTx: (hash: string) => `${POLIGON_ETHERSCAN_URL}/tx/${hash}`,
    exploreEns: (ens: string) => `https://app.ens.domains/name/${ens}/details`,
    chainIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
    assets: [
      {
        id: 'matic',
        address: ethers.constants.AddressZero,
        name: 'Matic',
        icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=023',
        decimals: 18,
      },
      {
        id: 'usdc',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        name: 'USDC',
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=022',
        decimals: 18,
      },
      {
        id: 'dai',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        name: 'DAI',
        icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023',
        decimals: 18,
      },
      {
        id: 'usdt',
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        name: 'USDT',
        icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=023',
        decimals: 18,
      },
    ],
  },
];

export enum SupportedChains {
  ethereum = 'Ethereum',
  localhost = 'Localhost',
}

export class ChainsDetails {
  static chainsAndAssets(includeIds?: number[]): ChainAndAssets[] {
    return chainList
      .map((chainAndAsset) => {
        return includeIds === undefined ||
          includeIds.includes(chainAndAsset.chain.id)
          ? chainAndAsset
          : undefined;
      })
      .filter((chain) => chain !== undefined) as ChainAndAssets[];
  }

  static chains(includeIds?: number[]): Chain[] {
    return ChainsDetails.chainsAndAssets(includeIds).map((c) => c.chain);
  }

  static chainOfId(id: number): ChainAndAssets | undefined {
    const entry = chainList.find((chain) => chain.chain.id === id);
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
    const entry = assets.find((asset) => cmpAddresses(asset.address, address));
    return entry;
  };

  static asset = (chainId: number, assetId: string): Asset | undefined => {
    const asset = this.chainAssets(chainId).find(
      (asset) => assetId === asset.id
    );
    return asset;
  };

  static isNative = (asset: Asset): boolean => {
    return cmpAddresses(asset.address, ethers.constants.AddressZero);
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
