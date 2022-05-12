import { CampaignController } from './CampaignController';

export const Routes = [
  {
    method: 'post',
    route: '/campaign/register',
    controller: CampaignController,
    action: 'register',
  },
  {
    method: 'post',
    route: '/campaign/simulate',
    controller: CampaignController,
    action: 'simulate',
  },
];
