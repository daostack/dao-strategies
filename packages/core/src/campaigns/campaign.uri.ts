import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { sha256 } from 'multiformats/hashes/sha2';

import { CampaignUriDetails } from '../types';

export const cidOfObject = async (obj: any): Promise<CID> => {
  const bytes = json.encode(obj);
  const hash = await sha256.digest(bytes);
  return CID.create(1, json.code, hash);
};

export const getCampaignUri = async (
  details: CampaignUriDetails
): Promise<string> => {
  const cid = await cidOfObject(details);
  return cid.toString();
};

export const hashOfObject = async (obj: any): Promise<string> => {
  const cid = await cidOfObject(obj);
  return cid.toString();
};
