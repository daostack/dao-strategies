import { Services } from '../types';

import { CampaignController } from './CampaignController';
import { Controller } from './Controller';
import { SocialApiController } from './SocialApiController';
import { UserController } from './UserController';

export interface RouteConfig {
  method: 'post' | 'get' | 'delete';
  route: string;
  controller: new (services: Services) => Controller;
  action: string;
  protected: boolean;
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
    route: '/campaign/simulateFromDetails',
    controller: CampaignController,
    action: 'simulateFromDetails',
    protected: true,
  },
  {
    method: 'post',
    route: '/campaign/simulateFromUri/:uri',
    controller: CampaignController,
    action: 'simulateFromUri',
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
    protected: false,
  },
  {
    method: 'post',
    route: '/user/verifyAddressOfGithub',
    controller: UserController,
    action: 'verifyAddressOfGithub',
    protected: false,
  },
  {
    method: 'post',
    route: '/user/verifyGithubOfAddress',
    controller: UserController,
    action: 'verifyGithubOfAddress',
    protected: false,
  },
  {
    method: 'post',
    route: '/social/github/exist',
    controller: SocialApiController,
    action: 'repoIsValid',
    protected: false, // TODO, change to true
  },
];
