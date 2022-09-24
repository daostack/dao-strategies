export const DEBUG = true;

/** ******************************
 * APP CONFIG:
 ****************************** */
export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/dao-strategies/campaign';
export const ORACLE_NODE_URL = 'http://localhost:3100';
// export const ORACLE_NODE_URL = 'https://api.commonvalue.xyz';
export const DOMAIN = window.location.hostname;
export const ORIGIN = window.location.origin;

export const DAYS = 24 * 60 * 60;

const oracleAddressMap = new Map<number, string>();

oracleAddressMap.set(5, '0xb6854477797132D6E5605792176E00a88bE6B76E');
oracleAddressMap.set(1337, '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'); // hh #2

export { oracleAddressMap };

export const CHALLENGE_PERIOD = 30; // 1 * DAYS;
export const ACTIVE_DURATION = 30; // 1 * DAYS;
export const ACTIVATION_PERIOD = 90; // 7 * DAYS;
export const ALCHEMY_GOERLI_KEY = 'aQapGNEneTscr5ixwb05r-J-OWEEwQvF';

export const INCLUDED_CHAINS = [1337, 5];
