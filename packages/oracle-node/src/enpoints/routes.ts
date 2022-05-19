import { CampaignController } from './CampaignController';
import { UserController } from './UserController';

export const Routes = [
  {
    method: 'post',
    route: '/campaign/register',
    controller: CampaignController,
    action: 'register',
  },
  {
    method: 'post',
    route: '/campaign/simulateFromDetails',
    controller: CampaignController,
    action: 'simulateFromDetails',
  },
  {
    method: 'get',
    route: '/user/me',
    controller: UserController,
    action: 'me',
  },
  {
    method: 'get',
    route: '/user/nonce',
    controller: UserController,
    action: 'nonce',
  },
  {
    method: 'post',
    route: '/user/verify',
    controller: UserController,
    action: 'verify',
  },
];
