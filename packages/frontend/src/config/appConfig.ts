export const DEBUG = true;

/** ******************************
 * APP CONFIG:
 ****************************** */
export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/dao-strategies/campaign';

export const ORACLE_NODE_URL = ((env: string) => {
  switch (env) {
    case 'production':
    case 'test-prod':
      return 'https://api.commonvalue.xyz';
    default:
      return 'http://localhost:3100';
  }
})(process.env.NODE_ENV);

export const DOMAIN = window.location.hostname;
export const ORIGIN = window.location.origin;

const oracleAddressMap = new Map<number, string>();

oracleAddressMap.set(1337, '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'); // hh #2
oracleAddressMap.set(5, '0xb6854477797132D6E5605792176E00a88bE6B76E');
oracleAddressMap.set(137, '0xb6854477797132D6E5605792176E00a88bE6B76E');

export { oracleAddressMap };

/**  */
export const MINUTES = 60;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;

// WARNING! These times must be larger than the expected tx mining time.
// Otherwise the tx may fail bacause it get's mined outside the expected active period.
// export const CHALLENGE_PERIOD = 1 * DAYS;
// export const ACTIVE_DURATION = 1 * DAYS;
// export const ACTIVATION_PERIOD = 7 * DAYS;

export const CHALLENGE_PERIOD = 30;
export const ACTIVE_DURATION = 30;
export const ACTIVATION_PERIOD = 90;

export const ALCHEMY_GOERLI_KEY = 'aQapGNEneTscr5ixwb05r-J-OWEEwQvF';

// export const INCLUDED_CHAINS = [1337, 5];
export const INCLUDED_CHAINS = process.env.NODE_ENV === 'production' ? [5, 137] : [1337, 5, 137];

export const GITHUB_DOMAINS = [
  'https://github.com/',
  'http://github.com/',
  'https://www.github.com/',
  'http://www.github.com/',
];

export const TELEGRAM_INVITE_LINK = 'https://telegram.com';
