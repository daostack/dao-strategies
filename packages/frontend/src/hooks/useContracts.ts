import { useContract, useSigner } from 'wagmi';

import { ContractsJson, Typechain } from '@dao-strategies/core';
import { ethers } from 'ethers';

export const useCampaignFactory = (chainId?: number): Typechain.CampaignFactory | undefined => {
  const { data: signer } = useSigner();

  const contract = useContract<Typechain.CampaignFactory>({
    addressOrName: chainId
      ? ContractsJson.jsonOfChain(chainId).contracts.CampaignFactory.address
      : ethers.constants.AddressZero,
    contractInterface: chainId ? ContractsJson.defaultJson().contracts.CampaignFactory.abi : {},
    signerOrProvider: signer,
  });

  if (chainId === undefined) return undefined;
  return contract;
};

export const useCampaignInstance = (address: string): Typechain.Campaign | undefined => {
  const { data: signer } = useSigner();

  return useContract<Typechain.Campaign>({
    addressOrName: address,
    contractInterface: ContractsJson.defaultJson().contracts.Campaign.abi,
    signerOrProvider: signer,
  });
};
