import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { sha256 } from 'multiformats/hashes/sha2';

import { Strategy_ID } from '../strategies';

export interface CampaignUriDetails {
  creator: string;
  nonce: number;
  execDate: number;
  strategyID: Strategy_ID;
  strategyParams: Record<string, any>;
}

export const getCampaignUriCid = async (
  details: CampaignUriDetails
): Promise<CID> => {
  const bytes = json.encode(details);
  const hash = await sha256.digest(bytes);
  return CID.create(1, json.code, hash);
};

export const getCampaignUri = async (
  details: CampaignUriDetails
): Promise<string> => {
  const cid = await getCampaignUriCid(details);
  return cid.toString();
};
