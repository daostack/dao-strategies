import {
  BalancesObject,
  balancesToObject,
  CampaignUriDetails,
  CampaignCreateDetails,
  CampaignOnchainDetails,
  CampaignClaimInfo,
  TimeDetails,
} from '@dao-strategies/core';
import { NextFunction, Request, Response } from 'express';
import { ServiceManager } from '../service.manager';

import { Services } from '../types';

import { Controller } from './Controller';
import { toCampaignExternal } from './toCampaignExternal';

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
  constructor(manager: ServiceManager) {
    super(manager);
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

    const uri = await this.manager.services.campaign.getOrCreate(
      request.body.details as CampaignUriDetails
    );
    return {
      uri,
      rewards: balancesToObject(
        await this.manager.services.campaign.runCampaignThrottled(uri)
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

    const uri = await this.manager.services.campaign.getOrCreate(
      request.body.details as CampaignUriDetails
    );
    return { uri };
  }

  timeNow(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<TimeDetails> {
    return Promise.resolve({ now: this.manager.services.time.now() });
  }

  async simulateFromUri(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<BalancesObject> {
    const uri: string = request.params.uri as string;
    return balancesToObject(
      await this.manager.services.campaign.runCampaignThrottled(uri)
    );
  }

  async register(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<void> {
    request.body.registered = true;
    await this.manager.services.campaign.register(
      request.params.uri as string,
      request.body as CampaignCreateDetails,
      loggedUser
    );
    const now = this.manager.services.time.now();

    await this.manager.execution.executeAndPublish(
      request.params.uri as string,
      now
    );
  }

  async getFromAddress(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<any> {
    /* eslint-disable */
    const campaign = await (this.manager.services.campaign.getFromAddress(
      request.params.address as string
    ) as any);

    return toCampaignExternal(campaign);
    /* eslint-enable */
  }

  async getCampaigns(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<any> {
    /* eslint-disable */
    const campaigns = await this.manager.services.campaign.list(loggedUser);

    return campaigns.map((campaign) => toCampaignExternal(campaign));
    /* eslint-enable */
  }

  getOtherDetails(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<CampaignOnchainDetails> {
    /* eslint-disable */
    return this.manager.services.campaignOnChain.getCampaignDetails(
      request.params.address as string
    );
    /* eslint-enable */
  }

  getClaimInfo(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<CampaignClaimInfo | undefined> {
    /* eslint-disable */
    return this.manager.services.campaignOnChain.getClaimInfo(
      request.params.address as string,
      request.params.account as string
    );
    /* eslint-enable */
  }
}
