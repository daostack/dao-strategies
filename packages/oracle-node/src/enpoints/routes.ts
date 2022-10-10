import { ServiceManager } from '../service.manager';

import { CampaignController } from './CampaignController';
import { Controller } from './Controller';
import { SocialApiController } from './SocialApiController';
import { UserController } from './UserController';

export interface RouteConfig {
  method: 'post' | 'get' | 'delete';
  route: string;
  controller: new (manager: ServiceManager) => Controller;
  action: string;
  protected: boolean;
  file?: boolean;
}

export const Routes: RouteConfig[] = [
  {
    method: 'post',
    route: '/campaign/register',
    controller: CampaignController,
    action: 'register',
    protected: true,
  },
  {
    method: 'post',
    route: '/campaign/uploadLogo/:uri',
    controller: CampaignController,
    action: 'uploadLogo',
    protected: true,
    file: true,
  },
  {
    method: 'post',
    route: '/campaign/sharesFromDetails',
    controller: CampaignController,
    action: 'sharesFromDetails',
    protected: true,
  },
  {
    method: 'post',
    route: '/campaign/sharesFromUri/:uri',
    controller: CampaignController,
    action: 'sharesFromUri',
    protected: false,
  },
  {
    method: 'post',
    route: '/campaign/funders/:uri',
    controller: CampaignController,
    action: 'getFunders',
    protected: false,
  },
  {
    method: 'post',
    route: '/campaign/fundEvents/:uri',
    controller: CampaignController,
    action: 'getFundEvents',
    protected: false,
  },
  {
    method: 'post',
    route: '/campaign/create',
    controller: CampaignController,
    action: 'create',
    protected: true,
  },
  {
    method: 'post',
    route: '/campaign/register/:uri',
    controller: CampaignController,
    action: 'register',
    protected: true,
  },
  {
    method: 'get',
    route: '/campaign/:address',
    controller: CampaignController,
    action: 'getFromAddress',
    protected: false,
  },
  {
    method: 'get',
    route: '/campaigns',
    controller: CampaignController,
    action: 'getCampaigns',
    protected: false,
  },
  {
    method: 'get',
    route: '/campaign/:address/otherDetails',
    controller: CampaignController,
    action: 'getOtherDetails',
    protected: false,
  },
  {
    method: 'get',
    route: '/campaign/claimInfo/:address/:account',
    controller: CampaignController,
    action: 'getClaimInfo',
    protected: false, // TODO, change to true
  },
  {
    method: 'get',
    route: '/time/now',
    controller: CampaignController,
    action: 'timeNow',
    protected: false,
  },
  {
    method: 'get',
    route: '/onchain/balanceOf/:chainId/:asset/:account',
    controller: CampaignController,
    action: 'balanceOf',
    protected: false,
  },
  {
    method: 'get',
    route: '/user/me',
    controller: UserController,
    action: 'me',
    protected: false,
  },
  {
    method: 'get',
    route: '/user/nonce',
    controller: UserController,
    action: 'nonce',
    protected: false,
  },
  {
    method: 'post',
    route: '/user/verify',
    controller: UserController,
    action: 'verify',
    protected: false,
  },
  {
    method: 'delete',
    route: '/user/logout',
    controller: UserController,
    action: 'logout',
    protected: true,
  },
  {
    method: 'post',
    route: '/user/checkVerification',
    controller: UserController,
    action: 'checkVerification',
    protected: false,
  },
  {
    method: 'get',
    route: '/social/github/repo/:org/:name',
    controller: SocialApiController,
    action: 'repoIsValid',
    protected: false, // TODO, change to true
  },
  {
    method: 'get',
    route: '/social/github/profile/:handle',
    controller: SocialApiController,
    action: 'getGithubProfile',
    protected: false, // TODO, change to true
  },
];
