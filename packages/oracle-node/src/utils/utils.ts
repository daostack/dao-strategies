import { TextEncoder } from 'util';

import { Balances } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import { sha256 } from 'multiformats/hashes/sha2';

export const hashReceivers = async (
  shares: Balances
): Promise<Map<Uint8Array, BigNumber>> => {
  const sharesToHash = new Map<Uint8Array, BigNumber>();

  await Promise.all(
    Array.from(shares.entries()).map(async ([userId, amount]) => {
      const utf8Encode = new TextEncoder();
      const bytes = utf8Encode.encode(userId);
      const hash = await sha256.digest(bytes);
      sharesToHash.set(hash.digest, amount);
    })
  );

  return sharesToHash;
};
