import { CampaignUriDetails } from '@dao-strategies/core';
import { Response } from 'express';

import { CampaignController } from '../src/enpoints/CampaignController';
import { ServiceManager } from '../src/service.manager';

describe('Test run', () => {
  let manager: ServiceManager;
  let campaign: CampaignController;
  const user1 = '0x0000000000000000000000000000000000000000';

  beforeAll(async () => {
    console.log('Initializing test');
    manager = new ServiceManager();
    campaign = new CampaignController(manager.services);

    await manager.resetDB();

    await manager.services.user.getOrCreate({
      address: user1,
    });
  });

  test('Create campaign', async () => {
    const details: CampaignUriDetails = {
      creator: user1,
      execDate: 0,
      nonce: 0,
      strategyID: 'GH_PRS_REACTIONS_WEIGHED',
      strategyParams: {
        repositories: [''],
        timeRange: {
          start: 0,
          end: 0,
        },
      },
    };

    const request: any = {
      body: {
        details,
      },
    };
    const result = await campaign.create(
      request,
      {} as Response,
      () => {},
      user1
    );
    console.log({ result });
  });
});
