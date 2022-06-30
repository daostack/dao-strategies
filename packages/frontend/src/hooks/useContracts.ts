import { ethers } from 'ethers';
import { useContract, useSigner } from 'wagmi';

import { contractsJson, Typechain } from '@dao-strategies/core';

export const useCampaignFactory = (): Typechain.CampaignFactory | undefined => {
  const { data: signer } = useSigner();
  //   const { activeChain } = useNetwork();

  //   const contractJson =
  //     activeChain === undefined
  //       ? undefined
  //       : (hardhatContractsJson as any)[activeChain.id][activeChain.name]['contracts']['CampaignFactory'];
  //   const abi = contractJson ? contractJson['abi'] : undefined;

  const contractJson = (contractsJson as any)['31337']['localhost']['contracts']['CampaignFactory'];

  return useContract<Typechain.CampaignFactory>({
    addressOrName: contractJson ? contractJson['address'] : ethers.constants.AddressZero,
    contractInterface: contractJson.abi,
    signerOrProvider: signer,
  });
};
