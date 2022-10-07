import {
  CampaignUriDetails,
  CampaignCreateDetails,
  CampaignOnchainDetails,
  CampaignClaimInfo,
  TimeDetails,
  SharesRead,
  Page,
  CampaignFundersRead,
  CampaignReadDetails,
  TokenBalance,
  FundEventRead,
  getAddressStrict
} from '@dao-strategies/core';
import { NextFunction, Request, Response } from 'express';

import { ServiceManager } from '../service.manager';

import { Controller } from './Controller';
import { toCampaignExternal } from './toCampaignExternal';

/**
 * On Retroactive Campaign
 * =======================
 *
 * The shares must be computed before the campaign
 * contract has been deployed (to inform the user).
 *
 * (Issue: a hacker can spam the oracle by creating thousands of different
 * campaigns, forcing us to hit the Github API rate-limit)
 *
 * In any case, this is the flow during campaign creation:
 *
 * - The frontend will gather the campaign configuration
 * - The frontend will call the `sharesFromDetails` endpoint.
 * - The oracle will compute the shares (in terms of social ids) and return them.
 * - The frontend will show the shares, and, if approved, deploy the smart contract and "register"
 *   the campaign in the oracle
 * - The oracle will set the merkle root.
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
  async sharesFromDetails(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<SharesRead> {
    if (loggedUser === undefined) {
      throw new Error('logged user expected but not found');
    }

    const details = request.body.details as CampaignUriDetails;
    const uri = await this.manager.services.campaign.getOrCreate(details);
    const shares = await this.manager.services.campaign.getSharesThrottled(
      uri,
      request.body.page as Page
    );

    shares.details = details;
    return shares;
  }

  async sharesFromUri(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<SharesRead> {
    const uri: string = request.params.uri as string;
    return this.manager.services.campaign.getSharesThrottled(
      uri,
      request.body.page as Page
    );
  }

  async create(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<{ uri: string }> {
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

  async uploadLogo(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<void> {
    const { logo } = request.files;
    const { uri } = request.params;

    if (!logo) {
      throw new Error('no files uploaded or no input named "logo" found, cant process with upload to s3');
    }
    if (!uri) {
      throw new Error('no uri specified, not able to create correct naming');
    }
    await this.manager.services.campaign.uploadLogoToS3(
      logo,
      uri as string, //uri is the campaignID
      loggedUser
    );
  }

  async getFromAddress(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<CampaignReadDetails> {
    /* eslint-disable */
    const address = getAddressStrict(request.params.address);
    /** update TVL everytime a user request the campaign object */
    await this.manager.services.indexingService.checkTvlUpdate(address);

    const campaign = await (this.manager.services.campaign.getFromAddress(
      address
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
    return this.manager.services.readDataService.getCampaignDetails(
      getAddressStrict(request.params.address)
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
    return this.manager.services.readDataService.getClaimInfo(
      getAddressStrict(request.params.address),
      getAddressStrict(request.params.account)
    );
    /* eslint-enable */
  }

  getFunders(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<CampaignFundersRead> {
    /* eslint-disable */
    return this.manager.services.indexingService.getCampaignFunders(
      request.params.uri as string,
      request.body.page as Page,
      request.body.force as boolean
    );
    /* eslint-enable */
  }

  getFundEvents(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<FundEventRead[]> {
    /* eslint-disable */
    const number =
      request.body.number !== undefined ? +request.body.number : 10;
    return this.manager.services.indexingService.getCampaignFundEvents(
      request.params.uri as string,
      number as number,
      request.body.force as boolean
    );
    /* eslint-enable */
  }

  async balanceOf(
    request: Request,
    response: Response,
    next: NextFunction,
    loggedUser: string | undefined
  ): Promise<TokenBalance> {
    /* eslint-disable */
    return this.manager.services.readDataService.getBalanceOf(
      request.params.asset as string,
      +request.params.chainId as number,
      request.params.account as string
    );
    /* eslint-enable */
  }
}
