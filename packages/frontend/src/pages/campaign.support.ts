import { BigNumber, ethers } from 'ethers';
import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';
import { balancesToObject, CampaignUriDetails } from '@dao-strategies/core';

import { CampaignCreatedEvent } from '../generated/typechain/CampaignFactory';
import { CampaignFactory } from '../generated/typechain';
import { ORACLE_NODE_URL } from '../config/appConfig';
import { StrategyComputationMockFunctions } from '../mocks/strategy.computation';

const ZERO_BYTES32 = '0x' + '0'.repeat(64);

export interface SimulationResult {
  uri?: string;
  details?: CampaignUriDetails;
  rewards?: Record<string, unknown>;
}

/** the details of a campaign that are not used as part of the URI */
export interface CampaignCreateDetails {
  title: string;
  description: string;
  guardian: string;
  oracle: string;
  cancelDate: number;
  address: string;
}

/** The details of a read campaign that are available on the frontend,
 * not all of them are part of the campaign URI and can be edited
 * by the campaign creator.
 */
export interface CampaignDetails {
  uri: string;
  title: string;
  description: string;
  creator: string;
  guardina: string;
  oracle: string;
  execDate: number;
  cancelDate: number;
  strategyID: string;
  strategyParams: Record<string, any>;
  address: string;
}

export const simulateCampaign = async (details: CampaignUriDetails): Promise<SimulationResult> => {
  const rewards = await StrategyComputationMockFunctions.runStrategy(details.strategyID, details.strategyParams);

  return {
    uri: '',
    rewards: balancesToObject(rewards),
    details,
  };

  // const response = await fetch(ORACLE_NODE_URL + '/campaign/simulateFromDetails', {
  //   method: 'post',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ details }),
  //   credentials: 'include',
  // });

  // const result = await response.json();
  // return {
  //   uri: result.uri,
  //   rewards: result.rewards,
  //   details,
  // };
};

export const createCampaign = async (details: CampaignUriDetails): Promise<string> => {
  const response = await fetch(ORACLE_NODE_URL + '/campaign/create', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ details }),
    credentials: 'include',
  });

  const result = await response.json();
  return result.uri;
};

export const deployCampaign = async (
  campaignFactory: CampaignFactory,
  uri: string | undefined,
  otherDetails: CampaignCreateDetails,
  details: CampaignUriDetails | undefined
) => {
  let uriDefined;
  if (uri !== undefined) {
    uriDefined = uri;
  } else {
    /** if the campaign was not previously simulated we store it in the oracle and get its
     * uri. (without simulating it) */
    if (details === undefined) throw new Error();
    uriDefined = await createCampaign(details);
  }

  /** raw hash 32-bit wide is exctracted from URI CID  */
  const uriCid = CID.parse(uriDefined, base32);

  if (uriCid == null) throw new Error(`uri ${uri} is not a CID`);

  const ex = await campaignFactory.createCampaign(
    { sharesMerkleRoot: ZERO_BYTES32, totalShares: BigNumber.from(0) },
    uriCid.multihash.digest,
    otherDetails.guardian,
    otherDetails.oracle,
    false,
    ethers.BigNumber.from(1000),
    /** the campaign uri uniquely and deterministically determines the campaign contract address */
    uriCid.multihash.digest
  );
  const txReceipt = await ex.wait();

  if (txReceipt.events === undefined) throw new Error('txReceipt.events undefined');
  const event = txReceipt.events.find((e) => e.event === 'CampaignCreated') as CampaignCreatedEvent;

  if (event === undefined) throw new Error('event undefined');
  if (event.args === undefined) throw new Error('event.args undefined');

  const address = event.args.newCampaign;

  /** for now, the oracle is informed about the newly created campaign from this call, in the future, the
   * oracle might watch the blockchain */
  otherDetails.address = address;
  await registerCampaign(uriDefined, otherDetails);

  return address;
};

export const registerCampaign = async (uri: string, details: CampaignCreateDetails) => {
  /** a deployed campaign is registered in the backend */

  await fetch(ORACLE_NODE_URL + `/campaign/register/${uri}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
    credentials: 'include',
  });
};

export const getCampaign = async (uri: string): Promise<CampaignDetails> => {
  const response = await fetch(ORACLE_NODE_URL + `/campaign/${uri}`, {
    method: 'get',
    credentials: 'include',
  });

  const data = await response.json();
  return data;
};
