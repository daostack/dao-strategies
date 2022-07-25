import { TextEncoder } from 'util';

import { Balances } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import { sha256 } from 'multiformats/hashes/sha2';

export const bigIntToNumber = (
  bn: bigint | null | undefined
): number | undefined => {
  if (bn === undefined || bn == null) {
    return undefined;
  }
  if (bn > Number.MAX_SAFE_INTEGER) {
    return NaN;
  }
  return Number(bn);
};

export const BigNumberToNumber = (
  bn: BigNumber | undefined
): number | undefined => {
  if (bn === undefined || bn == null) {
    return undefined;
  }
  if (bn.gt(BigNumber.from(Number.MAX_SAFE_INTEGER.toString()))) {
    return NaN;
  }
  return Number(bn);
};

export const hashReceivers = async (
  rewards: Balances
): Promise<Map<Uint8Array, BigNumber>> => {
  const rewardsToHash = new Map<Uint8Array, BigNumber>();

  await Promise.all(
    Array.from(rewards.entries()).map(async ([userId, amount]) => {
      const utf8Encode = new TextEncoder();
      const bytes = utf8Encode.encode(userId);
      const hash = await sha256.digest(bytes);
      rewardsToHash.set(hash.digest, amount);
    })
  );

  return rewardsToHash;
};
