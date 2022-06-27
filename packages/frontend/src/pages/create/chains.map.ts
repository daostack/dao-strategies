import hardhatContractsJson from '../../generated/hardhat_contracts.json';

const ERC20Json: any = (hardhatContractsJson as any)['31337']['localhost']['contracts']['TestErc20'];

export enum ChainName {
  Ethereum = 'ethereum-mainnet',
  GnosisChain = 'gnosis-chain',
  Avalanche = 'avalanche-c-chain',
  Sepolia = 'sepolia',
  Localhost = 'localhost',
}

export const ChainsDetails: {
  [chain: string]: {
    id: number;
    fullName: string;
    assets: {
      [assetId: string]: {
        address: string;
        name: string;
      };
    };
  };
} = {
  [ChainName.Localhost]: {
    id: 31337,
    fullName: 'Localhost',
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

export const nameOfFullName = (fullName: string): string => {
  const entry = Object.entries(ChainsDetails).find(([_, details]) => details.fullName === fullName);
  if (entry === undefined) throw new Error(`chain with fullname ${fullName} not found`);
  return entry[0];
};
