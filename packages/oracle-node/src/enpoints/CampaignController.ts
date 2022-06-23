import {
  BalancesObject,
  balancesToObject,
  CampaignUriDetails,
} from '@dao-strategies/core';
import { Campaign } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { CampaignCreateDetails } from '../services/types';
import { Services } from '../types';
import { toNumber } from '../utils/utils';

import { Controller } from './Controller';

/**
 * On Retroactive Campaign
 * =======================
 *
 * The rewards must be computed before the campaign
 * contract has been deployed (to inform the user).
 *
 * (Issue: a hacker can spam the oracle by creating thousands of different
 * campaigns, forcing us to hit the Github API rate-limit)
 *
 * In any case, this is the flow during campaign creation:
 *
 * - The frontend will gather the campaign configuration
 * - The frontend will call the `simulate` endpoint.
 * - The oracle will compute the rewards (in terms of social ids) and return them.
 * - The frontend will show the rewards, and, if approved, deploy the smart contract and "register"
 *   the campaign in the oracle
 * - The oracle will wait for the grace period, execute the strategy, and set the merkle root.
 */

/* eslint-disable 
    @typescript-eslint/no-unsafe-assignment, 
    @typescript-eslint/no-unsafe-member-access,
    unused-imports/no-unused-vars-ts */

export class CampaignController extends Controller {
  constructor(services: Services) {
    super(services);
  }

  /** */
  async simulateFromDetails(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<{ uri: string; rewards: BalancesObject }> {
    if (loggedUser === undefined) {
      throw new Error('logged user expected but not found');
    }

    const uri = await this.services.campaign.getOrCreate(
      request.body.details as CampaignUriDetails,
      loggedUser
    );
    return {
      uri,
      rewards: balancesToObject(
        await this.services.campaign.runCampaignThrottled(uri)
      ),
    };
  }

  async create(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<BalancesObject> {
    if (loggedUser === undefined) {
      throw new Error('logged user expected but not found');
    }

    const uri = await this.services.campaign.getOrCreate(
      request.body.details as CampaignUriDetails,
      loggedUser
    );
    return { uri };
  }

  async simulateFromUri(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<BalancesObject> {
    const uri: string = request.params.uri as string;
    return balancesToObject(
      await this.services.campaign.runCampaignThrottled(uri)
    );
  }

  async register(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<void> {
    request.body.registered = true;
    await this.services.campaign.register(
      request.params.uri as string,
      request.body as CampaignCreateDetails
    );
  }

  async getFromAddress(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<any> {
    /* eslint-disable */
    const campaign = await (this.services.campaign.getFromAddress(
      request.params.address as string
    ) as any);

    campaign.lastRunDate = toNumber(campaign.lastRunDate);
    campaign.execDate = toNumber(campaign.execDate);
    campaign.publishDate = toNumber(campaign.publishDate);
    campaign.cancelDate = toNumber(campaign.cancelDate);

    return campaign;
    /* eslint-enable */
  }
}
