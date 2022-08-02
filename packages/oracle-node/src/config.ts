/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access, 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-var-requires */
import { WorldConfig } from '@dao-strategies/core';
import { ExecutionConfig } from './services/ExecutionService';

require('dotenv').config();

export const worldConfig: WorldConfig = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
};

export const port = process.env.PORT;

/** Resimulate shares if older than X seconds */
export const resimulationPeriod: number = 30;

export const GITHUB_API = 'https://api.github.com/';
export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/';

export const PRICE_UPDATE_PERIOD = +process.env.PRICE_UPDATE_PERIOD;

export const config: ExecutionConfig = {
  world: worldConfig,
  executionWatcher: { enabled: true, period: 10 },
  republishWatcher: { enabled: true, period: 10 },
  republishTimeMargin: 5,
};
