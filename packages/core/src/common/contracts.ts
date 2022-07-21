import { Provider } from '@wagmi/core';
import { Contract, Signer } from 'ethers';

import { Campaign } from '../generated/typechain';

import { ContractsJson } from './contracts.json';

export const campaignInstance = (address: string, signer: Signer): Campaign => {
  const contract = new Contract(
    address,
    /* eslint-disable */
    ContractsJson.jsonOfChain().contracts.Campaign.abi,
    /* eslint-enable */
    signer
  );
  return contract as Campaign;
};

export const campaignProvider = (
  address: string,
  provider: Provider
): Campaign => {
  const contract = new Contract(
    address,
    /* eslint-disable */
    ContractsJson.jsonOfChain().contracts.Campaign.abi,
    /* eslint-enable */
    provider
  );
  return contract as Campaign;
};
