import contractsJson from '../generated/hardhat_contracts.json';

const ERC20Json: any = (contractsJson as any)['31337']['localhost'][
  'contracts'
]['TestErc20'];

export { contractsJson };

export enum ChainKey {
  Ethereum = 'ethereum-mainnet',
  GnosisChain = 'gnosis-chain',
  Avalanche = 'avalanche-c-chain',
  Sepolia = 'sepolia',
  Localhost = 'localhost',
}

export const ChainsDetails: {
  [chain: string]: {
    id: number;
    name: string;
    assets: {
      [assetId: string]: {
        address: string;
        name: string;
      };
    };
  };
} = {
  [ChainKey.Localhost]: {
    id: 31337,
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
    },
  },
};

export const keyOfName = (name: string): ChainKey => {
  const entry = Object.entries(ChainsDetails).find(
    ([_, details]) => details.name === name
  );
  if (entry === undefined) throw new Error(`chain with name ${name} not found`);
  return entry[0] as ChainKey;
};

export const assetKeyOfName = (
  chainKey: ChainKey,
  assetName: string
): string => {
  const entry = Object.entries(ChainsDetails[chainKey].assets).find(
    ([_, details]) => details.name === assetName
  );
  if (entry === undefined)
    throw new Error(`asset with name ${assetName} not found`);
  return entry[0];
};

export const isNative = (chainKey: ChainKey, asset: string) =>
  asset === ChainsDetails[chainKey].assets.native.name;

export const assetAddress = (chainKey: ChainKey, asset: string) =>
  ChainsDetails[chainKey].assets[assetKeyOfName(chainKey, asset)].address;
