import { BalancesObject, balancesToObject } from '@dao-strategies/core';
import { NextFunction, Request, Response } from 'express';

import { CampaignUriDetails } from '../services/CampaignUri';
import { Services } from '../types';

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
    next: NextFunction
  ): Promise<BalancesObject> {
    /** Build the candidate CampaignUri */
    const details: CampaignUriDetails = {
      creator: request.user,
      nonce: 0,
      execDate: request.body.execDate,
      strategyID: request.body.strategyID,
      strategyParams: request.body.strategyParams,
    };

    const uri = await this.services.campaign.getOrCreate(details, '');
    return balancesToObject(await this.services.campaign.computeRewards(uri));
  }

  async simulateFromUri(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<BalancesObject> {
    const uri: string = request.body.uri;
    return balancesToObject(await this.services.campaign.computeRewards(uri));
  }
}
