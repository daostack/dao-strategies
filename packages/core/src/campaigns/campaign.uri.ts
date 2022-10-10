import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { Digest } from 'multiformats/hashes/digest';
import { sha256 } from 'multiformats/hashes/sha2';

import { CampaignUriDetails } from '../types';

export const hashObject = async (obj: any): Promise<Digest<18, number>> => {
  const bytes = json.encode(obj);
  return sha256.digest(bytes);
};

export const getCampaignUriCid = async (
  details: CampaignUriDetails
): Promise<CID> => {
  const hash = await hashObject(details);
  return CID.create(1, json.code, hash);
};

export const getCampaignUri = async (
  details: CampaignUriDetails
): Promise<string> => {
  const cid = await getCampaignUriCid(details);
  return cid.toString();
};
