import { ChainsDetails } from '@dao-strategies/core';
import { AssetPrice, PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

import { COINGECKO_URL } from '../config';
import { appLogger } from '../logger';
import { bigIntToNumber } from '../utils/utils';

import { TimeService } from './TimeService';

export class PriceService {
  protected getting: Map<string, Promise<AssetPrice>> = new Map();
  constructor(
    protected client: PrismaClient,
    protected timeService: TimeService,
    protected updatePeriod: number = 300
  ) {}

  async priceOf(chainId: number, address: string): Promise<number> {
    const unique = chainId.toString().concat(address);

    /** Cached version of get price. Local map will return ongoing promises
     * then DB will cache and ultimately API will be hit
     */
    if (this.getting.has(unique)) {
      return new Promise<number>((resolve) => {
        void this.getting
          .get(unique)
          .then((assetPrice) => resolve(assetPrice.price));
      });
    }

    let get: Promise<AssetPrice>;

    get = new Promise<AssetPrice>((resolve) => {
      void this.client.assetPrice
        .findUnique({
          where: {
            chainId_address: {
              address,
              chainId,
            },
          },
        })
        .then((assetPrice) => {
          resolve(assetPrice);
        });
    });

    this.getting.set(unique, get);

    const cached = await get;

    const now = this.timeService.now();
    const shouldUpdate =
      cached === null ||
      now - bigIntToNumber(cached.lastUpdated) > this.updatePeriod;

    if (!shouldUpdate) {
      this.getting.delete(unique);
      return cached.price;
    }

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

    get = new Promise<AssetPrice>((resolve) => {
      /* eslint-disable */
      void fetch(
        `${COINGECKO_URL}/simple/price?ids=${assetId}&vs_currencies=${vs}`,
        {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        }
      ).then((response) => {
        response.json().then((result) => {
          resolve({
            address,
            chainId,
            lastUpdated: BigInt(now),
            price: result[assetId][vs],
          });
        });
        /* eslint-enable */
      });
    });

    this.getting.set(unique, get);

    appLogger.info(
      `Getting asset price from coingecko - chainId:${chainId}, address:${address}`
    );
    const assetPrice = await get;

    await this.client.assetPrice.upsert({
      where: {
        chainId_address: {
          address,
          chainId,
        },
      },
      create: {
        ...assetPrice,
      },
      update: {
        price: assetPrice.price,
      },
    });

    return assetPrice.price;
  }
}
