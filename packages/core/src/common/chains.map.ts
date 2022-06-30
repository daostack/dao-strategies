import contractsJson from '../generated/hardhat_contracts.json';

const ERC20Json: any = (contractsJson as any)['31337']['localhost'][
  'contracts'
]['TestErc20'];

export { contractsJson };

/** A string version of the chain id */
export enum ChainId {
  Ethereum = '1',
  GnosisChain = '100',
  Avalanche = '43114',
  Sepolia = '11155111',
  Localhost = '31337',
}

interface Asset {
  address: string;
  name: string;
}

interface Assets {
  [assetId: string]: Asset;
}

interface Chain {
  name: string;
  assets: Assets;
}

const map: {
  [chainId: string]: Chain;
} = {
  [ChainId.Localhost]: {
    name: 'Localhost',
    assets: {
      native: {
        address: '',
        name: 'Ether',
      },
      dai: {
        address: ERC20Json.address,
        name: 'DAI',
      },
      usdc: {
        address: ERC20Json.address,
        name: 'USDC',
      },
    },
  },
};

export class ChainsDetails {
  static chainKeyOfName = (name: string): ChainId => {
    const entry = Object.entries(map).find(
      ([_, details]) => details.name === name
    );
    if (entry === undefined)
      throw new Error(`chain with name ${name} not found`);
    return entry[0] as ChainId;
  };

  static assetKeyOfName = (chainKey: ChainId, assetName: string): string => {
    const entry = Object.entries(map[chainKey].assets).find(
      ([_, details]) => details.name === assetName
    );
    if (entry === undefined)
      throw new Error(`asset with name ${assetName} not found`);
    return entry[0];
  };

  static chain = (
    chainKey: ChainId
  ): {
    name: string;
    assets: Assets;
  } => {
    return map[chainKey];
  };

  static chainAssets = (chainKey: ChainId): Assets => {
    return map[chainKey].assets;
  };

  static chainAssetsArray = (chainKey: ChainId): Asset[] => {
    const assets = ChainsDetails.chainAssets(chainKey);
    return Object.keys(assets).map((asset) => assets[asset]);
  };

  static chainAsset = (chainKey: ChainId, asset: string): Asset => {
    return ChainsDetails.chainAssets(chainKey)[asset];
  };

  static chainsArray = (): Chain[] => {
    return Object.keys(map).map((key) => map[key]);
  };

  static isNative = (asset: Asset): boolean => {
    return asset.address === '';
  };
}
