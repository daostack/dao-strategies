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

export async function awaitWithTimeout<T = any>(
  func: Promise<T>,
  timeout: number,
  timeoutError = new Error('Promise timed out')
): Promise<T> {
  return new Promise((resolve, reject): void => {
    const to = setTimeout(() => {
      console.log(`timeout`);
      reject(timeoutError);
    }, timeout);

    func
      .then((res: T) => {
        clearTimeout(to);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
