import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';
import { CampaignUriDetails } from '@dao-strategies/core';

import { CampaignFactory } from '../generated/typechain';
import { ORACLE_NODE_URL } from '../config/appConfig';
import { CampaignFormValues } from './create/CampaignCreate';
import { DateManager } from '../utils/time';
import { ChainsDetails, nameOfFullName } from './create/chains.map';

const ZERO_BYTES32 = '0x' + '0'.repeat(64);

export type RewardsMap = Record<string, string>;

export interface SimulationResult {
  uri?: string;
  details?: CampaignUriDetails;
  rewards?: RewardsMap;
}

/** the details of a campaign that are not used as part of the URI */
export interface CampaignCreateDetails {
  title: string;
  description: string;
  guardian: string;
  oracle: string;
  cancelDate: number;
  chain: string;
  asset: string;
  address: string;
}

/** The details of a read campaign that are available on the frontend,
 * not all of them are part of the campaign URI and can be edited
 * by the campaign creator.
 */
/** should be the same as CampaignExternal in oracle */
export interface CampaignDetails {
  uri: string;
  title: string;
  description: string;
  creator: string;
  guardian: string;
  oracle: string;
  execDate: number;
  cancelDate: number;
  strategyID: string;
  strategyParams: Record<string, any>;
  address: string;
}

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

export enum PeriodType {
  retroactive = 'retroactive',
  ongoing = 'ongoing',
  future = 'future',
}

export const strategyDetails = (
  values: CampaignFormValues,
  today: DateManager,
  account: string | undefined
): CampaignUriDetails | undefined => {
  const repos = getRepos(values);
  const [start, end] = getStartEnd(values, today);

  return {
    creator: account !== undefined ? account : '',
    nonce: 0,
    execDate: end,
    strategyID: 'GH_PRS_REACTIONS_WEIGHED',
    strategyParams: {
      repositories: repos,
      timeRange: { start, end },
    },
  };
};

/** Derive the start and end timestamps from the form string values */
export const getStartEnd = (values: CampaignFormValues, today: DateManager): [number, number] => {
  if (values.livePeriodChoice === periodOptions.get(PeriodKeys.custom)) {
    let from = new DateManager(new Date(values.customPeriodChoiceFrom));
    let to = new DateManager(new Date(values.customPeriodChoiceFrom));

    from = from.setTimeOfDay('00:00:00');
    to = to.setTimeOfDay('00:00:00').addDays(1);

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

export const getPeriodType = (details: CampaignUriDetails | undefined, today: DateManager): PeriodType | undefined => {
  const params = details?.strategyParams;
  if (params === undefined || params.timeRange === undefined) return undefined;

  let type: PeriodType = PeriodType.future;

  if (params.timeRange.start < today.getTime()) {
    type = PeriodType.retroactive;
  }

  if (params.timeRange.end > today.getTime()) {
    type = PeriodType.ongoing;
  }

  return type;
};

export const simulateCampaign = async (details: CampaignUriDetails): Promise<SimulationResult> => {
  // const uri = await getCampaignUri(details);
  // const rewards = await new Promise<Balances>((resolve) => {
  //   setTimeout(() => {
  //     StrategyComputationMockFunctions.runStrategy(details.strategyID, details.strategyParams).then((r) => resolve(r));
  //   }, 2000);
  // });

  // return {
  //   uri,
  //   rewards: balancesToObject(rewards),
  //   details,
  // };

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

  const isNative = otherDetails.asset === ChainsDetails[nameOfFullName(otherDetails.chain)].assets.native.name;

  const ex = isNative
    ? await campaignFactory.createEthCampaign(
        ZERO_BYTES32,
        ZERO_BYTES32,
        uriCid.multihash.digest,
        otherDetails.guardian,
        otherDetails.oracle,
        uriCid.multihash.digest
      )
    : await campaignFactory.createErc20Campaign(
        ZERO_BYTES32,
        ZERO_BYTES32,
        uriCid.multihash.digest,
        otherDetails.guardian,
        otherDetails.oracle,
        uriCid.multihash.digest,
        otherDetails.asset
      );
  const txReceipt = await ex.wait();

  if (txReceipt.events === undefined) throw new Error('txReceipt.events undefined');
  const event = txReceipt.events.find((e) =>
    isNative ? e.event === 'EthCampaignCreated' : e.event === 'Erc20CampaignCreated'
  );

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
