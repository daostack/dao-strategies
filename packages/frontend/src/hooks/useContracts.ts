import { ethers } from 'ethers';
import { useContract, useSigner } from 'wagmi';

import hardhatContractsJson from '../generated/hardhat_contracts.json';
import { CampaignFactory } from '../generated/typechain';

export const useCampaignFactory = (): CampaignFactory | undefined => {
  const { data: signer } = useSigner();
  //   const { activeChain } = useNetwork();

  //   const contractJson =
  //     activeChain === undefined
  //       ? undefined
  //       : (hardhatContractsJson as any)[activeChain.id][activeChain.name]['contracts']['CampaignFactory'];
  //   const abi = contractJson ? contractJson['abi'] : undefined;

  const contractJson = (hardhatContractsJson as any)['31337']['localhost']['contracts']['CampaignFactory'];

  return useContract<CampaignFactory>({
    addressOrName: contractJson ? contractJson['address'] : ethers.constants.AddressZero,
    contractInterface: contractJson.abi,
    signerOrProvider: signer,
  });
};
