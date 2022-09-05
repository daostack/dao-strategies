import { ChainsDetails, bigIntToNumber } from '@dao-strategies/core';
import { AssetPrice, PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

import { COINGECKO_URL } from '../config';
import { appLogger } from '../logger';

import { TimeService } from './TimeService';

const DEBUG = false;

export class PriceService {
  protected getting: Map<string, Promise<AssetPrice>> = new Map();
  constructor(
    protected client: PrismaClient,
    protected timeService: TimeService,
    protected updatePeriod: number = 300
  ) {}

  async priceOf(chainId: number, address: string): Promise<number | undefined> {
    const unique = chainId.toString().concat(address);

    if (DEBUG) appLogger.debug(`getPriceOf ${unique}`);

    /** Cached version of get price. Local map will return ongoing promises
     * then DB will cache and ultimately API will be hit
     */
    if (this.getting.has(unique)) {
      if (DEBUG) appLogger.debug(`getting found ${unique}`);
      return new Promise<number>((resolve, reject) => {
        void this.getting
          .get(unique)
          .then((assetPrice) => {
            this.getting.delete(unique);
            if (DEBUG) appLogger.debug(`getting deleted ${unique}`);
            resolve(assetPrice !== null ? assetPrice.price : undefined);
          })
          .catch((error) => reject(error));
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

    if (DEBUG) appLogger.debug(`this.getting.set DB ${unique}`);
    this.getting.set(unique, get);

    if (DEBUG) appLogger.debug(`getting from DB ${unique}`);
    const cached = await get;
    if (DEBUG)
      appLogger.debug(
        `gotten from DB ${unique} ${
          cached !== null ? JSON.stringify(cached) : 'null'
        }`
      );

    const now = this.timeService.now();
    const shouldUpdate =
      cached === null ||
      now - bigIntToNumber(cached.lastUpdated) > this.updatePeriod;

    if (DEBUG)
      appLogger.debug(
        `shouldUpdate: ${shouldUpdate}, 
        now: ${now}, 
        lastUpdated: ${cached !== null ? cached.lastUpdated : 'null'}, 
        period: ${this.updatePeriod} ${unique}`
      );

    if (!shouldUpdate) {
      this.getting.delete(unique);
      if (DEBUG) appLogger.debug(`returning from DB ${unique}`);
      return cached.price;
    }

    const asset = ChainsDetails.assetOfAddress(chainId, address);

    /** if the asset is not in the list of suppoerted assets for the chain return undefined */
    if (!asset) {
      this.getting.delete(unique);
      if (DEBUG) appLogger.debug(`asset not supported ${unique}`);
      return undefined;
    }

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

    get = new Promise<AssetPrice>((resolve, reject) => {
      /* eslint-disable */
      void fetch(
        `${COINGECKO_URL}/simple/price?ids=${assetId}&vs_currencies=${vs}`,
        {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        }
      ).then((response) => {
        response.json().then((result) => {
          if (result.status && result.status.error_code) {
            this.getting.delete(unique);
            reject(new Error(result.status.error_message));
          }
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
    if (DEBUG) appLogger.debug(`this.getting.set CG ${unique}`);

    appLogger.info(
      `Getting asset price from coingecko - chainId:${chainId}, address:${address}`
    );
    const assetPrice = await get;

    if (DEBUG)
      appLogger.debug(
        `setting price on DB ${JSON.stringify(assetPrice)} ${unique}`
      );
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
        lastUpdated: assetPrice.lastUpdated,
      },
    });

    this.getting.delete(unique);
    if (DEBUG) appLogger.debug(`returning price from CG ${unique}`);

    return assetPrice.price;
  }
}
