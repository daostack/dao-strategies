import { Provider } from '@wagmi/core';
import { Contract } from 'ethers';

import { Campaign } from '../generated/typechain';

import { ContractsJson } from './contracts.json';

export const campaignInstance = (
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
