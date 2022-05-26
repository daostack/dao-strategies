import { StrategyComputation } from '@dao-strategies/core';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from 'express';
import * as expressWinston from 'express-winston';
import * as winston from 'winston';

import { port, worldConfig } from './config';
import { Routes } from './enpoints/routes';
import { CampaignRepository } from './repositories/campaignRepository';
import { CampaignService } from './services/CampaignService';
import { TimeService } from './services/TimeService';
import { Services } from './types';

/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access,
  unused-imports/no-unused-vars-ts,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/ban-types */

function handleError(err, req, res, next): void {
  res.status(err.statusCode || 500).send({ message: err.message });
}

export const oracleLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// create express app
const app = express();

/** CORS configuration */
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

/** Logger configuration */
app.use(
  expressWinston.logger({
    transports: oracleLogger.transports,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    expressFormat: true,
    colorize: true,
    ignoreRoute: function (req, res) {
      return true;
    },
  })
);

/** JSON body parser */
app.use(bodyParser.json());

/** Register routes */
Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    async (req: Request, res: Response, next: Function) => {
      try {
        const campaignRepo = new CampaignRepository();
        const strategyComputation = new StrategyComputation(worldConfig);
        const timeService = new TimeService();
        const repos: Services = {
          campaign: new CampaignService(
            campaignRepo,
            timeService,
            strategyComputation
          ),
          time: new TimeService(),
        };
        const result = await new (route.controller as any)(repos)[route.action](
          req,
          res,
          next
        );
        res.json(result);
      } catch (error) {
        throw error;
        oracleLogger.error(error.message);
        next(error);
      }
    }
  );
});

// start express server
app.use(handleError);
app.listen(port);

console.log(`Express server has started on port ${port}.`);
