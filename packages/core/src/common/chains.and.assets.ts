import { Chain, chain } from '@wagmi/core';
import { ethers } from 'ethers';

import { ContractsJson } from './contracts.json';

/** Single source of truth for the supported chains and assets. It is imported on the
 * frontend */

export interface Asset {
  id: string;
  address: string;
  name: string;
  icon: string;
}

export interface ChainAndAssets {
  chainIcon: string;
  chain: Chain;
  assets: Asset[];
}

const chainList: ChainAndAssets[] = [
  {
    chain: chain.localhost,
    chainIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
    assets: [
      {
        id: 'ether',
        address: ethers.constants.AddressZero,
        name: 'Ether',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
      },
      {
        id: 'dai',
        address: ContractsJson.jsonOfChain().contracts.TestErc20.address,
        name: 'DAI',
        icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      },
      {
        id: 'usdc',
        address: ContractsJson.jsonOfChain().contracts.TestErc20_02.address,
        name: 'USDC',
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=022',
      },
    ],
  },
];

export class ChainsDetails {
  static chains(): Chain[] {
    return chainList.map((chainAndAsset) => chainAndAsset.chain);
  }

  static chainOfId(id: number): ChainAndAssets {
    const entry = chainList.find((chain) => chain.chain.id === id);
    if (entry === undefined) throw new Error(`chain with id ${id} not found`);
    return entry;
  }

  static chainOfName = (name: string): ChainAndAssets => {
    const entry = chainList.find((chain) => chain.chain.name === name);
    if (entry === undefined)
      throw new Error(`chain with name ${name} not found`);
    return entry;
  };

  static chainAssets = (chainId: number): Asset[] => {
    return this.chainOfId(chainId).assets;
  };

  static assetOfName = (chainId: number, assetName: string): Asset => {
    const assets = this.chainAssets(chainId);
    const entry = assets.find((asset) => asset.name === assetName);
    if (entry === undefined)
      throw new Error(`asset with name ${assetName} not found`);
    return entry;
  };

  static asset = (chainId: number, assetId: string): Asset => {
    const asset = this.chainAssets(chainId).find(
      (asset) => assetId === asset.id
    );
    if (asset === undefined)
      throw new Error(`asset with name ${assetId} not found`);
    return asset;
  };

  static isNative = (asset: Asset): boolean => {
    return asset.address === ethers.constants.AddressZero;
  };
}
