import { useContract, useSigner } from 'wagmi';

import { ContractsJson, Typechain } from '@dao-strategies/core';

export const useCampaignFactory = (): Typechain.CampaignFactory | undefined => {
  const { data: signer } = useSigner();
  //   const { activeChain } = useNetwork();

  //   const contractJson =
  //     activeChain === undefined
  //       ? undefined
  //       : (hardhatContractsJson as any)[activeChain.id][activeChain.name]['contracts']['CampaignFactory'];
  //   const abi = contractJson ? contractJson['abi'] : undefined;

  return useContract<Typechain.CampaignFactory>({
    addressOrName: ContractsJson.jsonOfChain().contracts.CampaignFactory.address,
    contractInterface: ContractsJson.jsonOfChain().contracts.CampaignFactory.abi,
    signerOrProvider: signer,
  });
};

export const useCampaignInstance = (address: string): Typechain.Campaign | undefined => {
  const { data: signer } = useSigner();

  return useContract<Typechain.Campaign>({
    addressOrName: address,
    contractInterface: ContractsJson.jsonOfChain().contracts.Campaign.abi,
    signerOrProvider: signer,
  });
};
