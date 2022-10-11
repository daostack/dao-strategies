import { getAddress } from '@dao-strategies/core';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import express, { Request, Response } from 'express';
import Session from 'express-session';
import expressWinston from 'express-winston';
import winston from 'winston';

import { config, port } from './config';
import { Routes } from './enpoints/routes';
import { appLogger } from './logger';
import { ServiceManager } from './service.manager';

// import { createRedisClient } from './utils/redisClient';
// const RedisStore = require("connect-redis")(Session)

/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access,
  unused-imports/no-unused-vars-ts,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/ban-types */

function handleError(err, req, res, next): void {
  res.status(err.statusCode || 500).send({ message: err.message });
}

interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => string;
}
(BigInt.prototype as any).toJSON = function (): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return this.toString();
};

// create express app
const app = express();

appLogger.info(
  `Running in ${
    process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : 'default(dev)'
  } mode`
);

/** CORS configuration */
const corsOptions = {
  origin: ((env: string): any => {
    switch (env) {
      case 'production':
        return process.env.CORS_PROD.split(' ');
      case 'test-prod':
        return process.env.CORS_PROD.split(' ').concat(
          process.env.CORS_DEV.split(' ')
        );
      default:
        return process.env.CORS_DEV.split(' ');
    }
  })(process.env.NODE_ENV),
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

app.use(cors(corsOptions));

app.set('trust proxy', 1);

const cookieConfig = ((env: string): any => {
  switch (env) {
    case 'production':
    case 'test-prod':
      return {
        sameSite: 'none',
        secure: true, // if true only transmit cookie over https, only when frontend is also https ?
      };
    default:
      return {
        sameSite: true,
        secure: false, // if true only transmit cookie over https, only when frontend is also https ?
      };
  }
})(process.env.NODE_ENV);

app.use(
  Session({
    name: 'siwe-quickstart',
    secret: 'siwe-quickstart-secret',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
      ...cookieConfig,
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 10, // session max age in miliseconds
    },
  })
);

/** Logger configuration */
app.use(
  expressWinston.logger({
    transports: appLogger.transports,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    expressFormat: true,
    colorize: true,
    meta: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);

/** JSON body parser */
app.use(bodyParser.json());

const fileUploadOptions = {
  debug: process.env.NODE_ENV !== 'production',
  fileSize: 2e6,
};

/** Services instantiation (globally reused, we don's support hot loading the services) */
const manager = new ServiceManager(config);

/** --------------------- */

const nop = (req: any, res: any, next: any): any => {
  return next();
};

/** Register routes */
Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    route.file ? fileUpload(fileUploadOptions) : nop,
    async (req: Request, res: Response, next: Function) => {
      try {
        const loggedUser: string | undefined = getAddress(
          req.session?.siwe?.address
        );
        if (route.protected) {
          if (loggedUser === undefined) {
            throw new Error(
              'User not logged in and tried to access a protected endpoint'
            );
          }
        }

        const result = await new (route.controller as any)(manager)[
          route.action
        ](req, res, next, loggedUser);

        res.json(result === undefined ? {} : result);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  );
});

// start express server
app.use(handleError);
app.listen(port);

console.log(`Express server has started on port ${port}.`);
