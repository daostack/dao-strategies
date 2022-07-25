import { ChainsDetails } from '@dao-strategies/core';
import fetch from 'node-fetch';

import { COINGECKO_URL } from './../config';

export class PriceService {
  constructor(private key?: string) {}

  async priceOf(chainId: number, address: string): Promise<number> {
    const asset = ChainsDetails.assetOfAddress(chainId, address);

    const assetId = ((): string => {
      switch (asset.id) {
        case 'ether':
          return 'ethereum';
        case 'dai':
          return 'dai';
        case 'usdc':
          return 'usd-coin';
      }
    })();

    const vs = 'usd';

    const response = await fetch(
      `${COINGECKO_URL}/simple/price?ids=${assetId}&vs_currencies=${vs}`,
      {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    /* eslint-disable */
    const result = await response.json();
    return result[assetId][vs];
    /* eslint-enable */
  }
}
