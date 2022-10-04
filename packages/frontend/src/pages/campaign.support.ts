import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';
import {
  CampaignCreateDetails,
  CampaignReadDetails,
  CampaignUriDetails,
  ChainsDetails,
  Typechain,
  SharesRead,
} from '@dao-strategies/core';
import { ethers } from 'ethers';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { CampaignFormValues } from './create/CampaignCreate';
import { DateManager } from '../utils/date.manager';
import { Page } from '@dao-strategies/core';
import { toBase64 } from '../utils/general';

/** The period string is parsed to derive the actual period. That's why
 * we need to use enums and maps to avoid using manual strings as keys
 */
const LAST = 'Last';
const NEXT = 'Next';
const CUSTOM = 'Custom';

export enum PeriodKeys {
  last3Months = `last3Months`,
  last6Months = `last6Months`,
  next3Months = `next3Months`,
  next6Months = `next6Months`,
  custom = 'Custom',
}

export const periodOptions: Map<PeriodKeys, string> = new Map();

periodOptions.set(PeriodKeys.last3Months, `${LAST} 3 months`);
periodOptions.set(PeriodKeys.last6Months, `${LAST} 6 months`);
periodOptions.set(PeriodKeys.next3Months, `${NEXT} 3 months`);
periodOptions.set(PeriodKeys.next6Months, `${NEXT} 6 months`);
periodOptions.set(PeriodKeys.custom, CUSTOM);

export const SET_FROM_NOW = 'SET_FROM_NOW';

export enum PeriodType {
  retroactive = 'retroactive',
  ongoing = 'ongoing',
  future = 'future',
}

export enum ReactionConfig {
  PRS_AND_REACTS = 'PRS_AND_REACTS',
  ONLY_PRS = 'ONLY_PRS',
  ONLY_REACTS = 'ONLY_REACTS',
}

export const reactionConfigOptions: Map<ReactionConfig, string> = new Map();

reactionConfigOptions.set(ReactionConfig.PRS_AND_REACTS, 'Both Pull Requests & Reactions');
reactionConfigOptions.set(ReactionConfig.ONLY_PRS, 'Only Pull Requests');
reactionConfigOptions.set(ReactionConfig.ONLY_REACTS, 'Only Reactions');

export const strategyDetails = (
  values: CampaignFormValues,
  now: DateManager | undefined,
  account: string | undefined
): CampaignUriDetails | undefined => {
  if (now === undefined) return undefined;

  const repos = getRepos(values);
  const [start, end] = getStartEnd(values, now);

  return {
    creator: account !== undefined ? account : '',
    nonce: 0,
    execDate: end,
    strategyID: values.strategyId,
    strategyParams: {
      repositories: repos,
      timeRange: { start, end },
    },
  };
};

/** Derive the start and end timestamps from the form string values */
export const getStartEnd = (values: CampaignFormValues, today: DateManager): [number, number] => {
  if (values.livePeriodChoice === periodOptions.get(PeriodKeys.custom)) {
    if (values.customPeriodChoiceFrom === '' || values.customPeriodChoiceTo === '') {
      return [0, 0];
    }

    let from = DateManager.from(
      values.customPeriodChoiceFrom === SET_FROM_NOW ? today : values.customPeriodChoiceFrom,
      true
    );
    let to = DateManager.from(values.customPeriodChoiceTo, true);

    to = to.addDays(1);

    return [from.getTime(), to.getTime()];
  } else {
    const parts = values.livePeriodChoice.split(' ');
    let livePeriod = +parts[1];

    if (parts[0] === 'Last') livePeriod = -1 * livePeriod;

    return livePeriod < 0
      ? [today.clone().addMonths(livePeriod).getTime(), today.getTime()]
      : [today.getTime(), today.clone().addMonths(livePeriod).getTime()];
  }
};

export const getRepos = (values: CampaignFormValues): { owner: string; repo: string }[] => {
  return values.repositoryFullnames.map((repo) => {
    const parts = repo.split('/');
    return {
      owner: parts[0],
      repo: parts[1],
    };
  });
};

export const getPeriodType = (
  details: CampaignUriDetails | undefined,
  now: DateManager | undefined
): PeriodType | undefined => {
  if (now === undefined) return undefined;

  const params = details?.strategyParams;
  if (params === undefined || params.timeRange === undefined) return undefined;

  let type: PeriodType = PeriodType.future;

  if (params.timeRange.start < now.getTime()) {
    type = PeriodType.retroactive;
  }

  if (params.timeRange.end > now.getTime()) {
    type = PeriodType.ongoing;
  }

  return type;
};

export const sharesFromDetails = async (details: CampaignUriDetails, page: Page): Promise<SharesRead> => {
  const response = await fetch(ORACLE_NODE_URL + '/campaign/sharesFromDetails', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ details, page }),
    credentials: 'include',
  });

  const result = await response.json();
  return result;
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
  campaignFactory: Typechain.CampaignFactory,
  uri: string | undefined,
  createDetails: CampaignCreateDetails,
  details: CampaignUriDetails | undefined,
  logo: File | undefined,
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
  if (!details) throw new Error(`details undefined`);

  const uriHex = ethers.utils.hexlify(uriCid.multihash.digest);
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(Date.now().toString())); // uriHex;

  console.log(`campaignFactory.createCampaign`, { uriHex, createDetails });

  const ex = await campaignFactory.createCampaign(
    uriHex,
    createDetails.guardian,
    createDetails.oracle,
    createDetails.activationTime,
    createDetails.CHALLENGE_PERIOD,
    createDetails.ACTIVATION_PERIOD,
    createDetails.ACTIVE_DURATION,
    salt
  );

  const txReceipt = await ex.wait();

  if (txReceipt.events === undefined) throw new Error('txReceipt.events undefined');
  const event = txReceipt.events.find((e) => e.event === 'CampaignCreated');

  if (event === undefined) throw new Error('event undefined');
  if (event.args === undefined) throw new Error('event.args undefined');

  const address = event.args.newCampaign;

  /** for now, the oracle is informed about the newly created campaign from this call, in the future, the
   * oracle might watch the blockchain */
  createDetails.address = address;

  console.log('campaign contract deployed', { address });

  await registerCampaign(uriDefined, createDetails);
  await registerCampaignLogo(logo, uriDefined);  //do we need to await this? Can we show local logo ?
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

const registerCampaignLogo = async (logo: File | undefined, uri: string): Promise<void> => {
  // if no logo set, we can return
  if (!logo) return;

  const formData = new FormData();
  console.log('what is logo ', logo, ' or ')
  formData.append('logo', logo);

  await fetch(ORACLE_NODE_URL + `/campaign/uploadLogo/${uri}`, {
    method: 'post',
    body: formData,
    credentials: 'include',
  });

}

export const getCampaign = async (uri: string): Promise<CampaignReadDetails> => {
  const response = await fetch(ORACLE_NODE_URL + `/campaign/${uri}`, {
    method: 'get',
    credentials: 'include',
  });

  const data = await response.json();
  return data;
};

export const claimRewards = async (
  campaign: Typechain.Campaign,
  account: string,
  shares: string,
  proof: string[],
  assets: string[]
) => {
  const ex = await campaign.claim(account, shares, proof, assets, account);

  const txReceipt = await ex.wait();

  console.log(txReceipt);
  return;
};

export const lockCampaign = async (campaign: Typechain.Campaign, value: boolean) => {
  const ex = await campaign.setLock(value);

  const txReceipt = await ex.wait();

  console.log(txReceipt);
  return;
};
