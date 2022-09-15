import { ContractsJson } from './common';

export const LOCAL_CHAINID = 3117;

const chainConstants = new Map<number, { multicallAddress?: string }>();

chainConstants.set(1337, {
  /* eslint-disable */
  multicallAddress: ContractsJson.jsonOfChain(1337).contracts.Multicall.address,
  /* eslint-enable */
});

chainConstants.set(5, {
  multicallAddress: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
});

export { chainConstants };
