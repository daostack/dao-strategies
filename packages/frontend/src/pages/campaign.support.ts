import { BigNumber, ethers } from 'ethers';
import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';
import { CampaignUriDetails } from '@dao-strategies/core';

import { CampaignCreatedEvent } from '../generated/typechain/CampaignFactory';
import { CampaignFactory } from '../generated/typechain';
import { ORACLE_NODE_URL } from '../config/appConfig';

const ZERO_BYTES32 = '0x' + '0'.repeat(64);

export enum LivePeriodChoice {
  Last2Months = 'last-two-months',
}

export interface SimulationResult {
  uri: string;
  details?: CampaignUriDetails;
  rewards: Record<string, unknown>;
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
  const response = await fetch(ORACLE_NODE_URL + '/campaign/simulateFromDetails', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ details }),
    credentials: 'include',
  });

  const result = await response.json();
  return {
    uri: result.uri,
    rewards: result.rewards,
    details,
  };
};

export const deployCampaign = async (
  campaignFactory: CampaignFactory,
  uri: string,
  otherDetails: CampaignCreateDetails
) => {
  const uriCid = CID.parse(uri, base32);

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

  /** for now, we inform the orable about the newly created campaign, in the future, the
   * oracle might watch the blockchain */
  otherDetails.address = address;
  await registerCampaign(uri, otherDetails);

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
