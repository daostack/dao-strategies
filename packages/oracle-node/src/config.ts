import { WorldConfig } from '@dao-strategies/core';

require('dotenv').config();

export const worldConfig: WorldConfig = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
};

export const port = process.env.PORT;

/** Resimulate rewards every X seconds*/
export const resimulationPeriod: number = 30;
