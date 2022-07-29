import { Provider } from '@wagmi/core';
import { Multicall, ContractCallContext } from 'ethereum-multicall';
import { BigNumber, Contract, Signer } from 'ethers';

import { Campaign } from '../generated/typechain';
import { bigNumberToNumber } from '../support';

import { ContractsJson } from './contracts.json';
import { PublishInfo } from './types';

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

export const getCampaignPublishInfo = async (
  provider: Provider,
  address: string
): Promise<PublishInfo> => {
  const multicall = new Multicall({
    ethersProvider: provider,
    /* eslint-disable */
    multicallCustomContractAddress:
      ContractsJson.jsonOfChain().contracts.Multicall.address,
    /* eslint-enable */
  });

  const contractCallContext: ContractCallContext[] = [
    {
      reference: 'campaign',
      contractAddress: address,
      /* eslint-disable */
      abi: ContractsJson.jsonOfChain().contracts.Campaign.abi,
      /* eslint-enable */
      calls: [
        {
          reference: 'CHALLENGE_PERIOD',
          methodName: 'CHALLENGE_PERIOD',
          methodParameters: [],
        },
        {
          reference: 'ACTIVATION_PERIOD',
          methodName: 'ACTIVATION_PERIOD',
          methodParameters: [],
        },
        {
          reference: 'ACTIVE_DURATION',
          methodName: 'ACTIVE_DURATION',
          methodParameters: [],
        },
        {
          reference: 'approvedMerkleRoot',
          methodName: 'approvedMerkleRoot',
          methodParameters: [],
        },
        {
          reference: 'pendingMerkleRoot',
          methodName: 'pendingMerkleRoot',
          methodParameters: [],
        },
        {
          reference: 'activationTime',
          methodName: 'activationTime',
          methodParameters: [],
        },
        {
          reference: 'deployTime',
          methodName: 'deployTime',
          methodParameters: [],
        },
        {
          reference: 'locked',
          methodName: 'locked',
          methodParameters: [],
        },
        {
          reference: 'isProposeWindowActive',
          methodName: 'isProposeWindowActive',
          methodParameters: [],
        },
        {
          reference: 'getValidRoot',
          methodName: 'getValidRoot',
          methodParameters: [],
        },
      ],
    },
  ];

  const results = await multicall.call(contractCallContext);

  const block = await provider.getBlock(results.blockNumber);

  const getReturnedReference = <T>(reference: string): T => {
    const res = results.results.campaign.callsReturnContext.find(
      (r) => r.reference === reference
    );
    if (res === undefined) throw new Error(`reference ${reference} not found`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const val = res.returnValues[0];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return typeof val === 'object' ? bigNumberToNumber(val as BigNumber) : val;
  };

  const info: PublishInfo = {
    params: {
      challengePeriod: getReturnedReference<number>('CHALLENGE_PERIOD'),
      activationPeriod: getReturnedReference<number>('ACTIVATION_PERIOD'),
      activeDuration: getReturnedReference<number>('ACTIVE_DURATION'),
      deployTime: getReturnedReference<number>('deployTime'),
    },
    status: {
      activationTime: getReturnedReference<number>('activationTime'),
      approvedRoot: getReturnedReference<string>('approvedMerkleRoot'),
      pendingRoot: getReturnedReference<string>('pendingMerkleRoot'),
      validRoot: getReturnedReference<string>('getValidRoot'),
      locked: getReturnedReference<boolean>('locked'),
      blockNumber: block.number,
      timestamp: block.timestamp,
      isProposeWindowActive: getReturnedReference<boolean>(
        'isProposeWindowActive'
      ),
    },
  };

  const periodIx = Math.floor(
    (block.timestamp - info.params.deployTime) / info.params.activationPeriod
  );

  const nextWindowStarts =
    info.params.deployTime + (periodIx + 1) * info.params.activationPeriod;

  info.derived = {
    nextWindowStarts,
    nextWindowEnds: nextWindowStarts + info.params.activeDuration,
    periodIx,
  };

  return info;
};
