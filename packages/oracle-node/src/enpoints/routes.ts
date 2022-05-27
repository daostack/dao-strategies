import { Services } from '../types';

import { CampaignController } from './CampaignController';
import { Controller } from './Controller';
import { UserController } from './UserController';

export interface RouteConfig {
  method: 'post' | 'get';
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
    method: 'post',
    route: '/user/verifyGithub',
    controller: UserController,
    action: 'verifyGithub',
    protected: false,
  },
];
