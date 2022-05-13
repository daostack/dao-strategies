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
    route: '/campaign/simulateFromDetails',
    controller: CampaignController,
    action: 'simulateFromDetails',
  },
];
