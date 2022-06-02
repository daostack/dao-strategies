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
      execDate: 1654168561,
      nonce: 0,
      strategyID: 'GH_PRS_REACTIONS_WEIGHED',
      strategyParams: {
        repositories: [{ owner: 'gershido', repo: 'test-github-api' }],
        timeRange: {
          start: 1646133361,
          end: 1654168561,
        },
      },
    };

    const request: any = {
      body: {
        details,
      },
    };
    const create = await campaign.simulateFromDetails(
      request,
      {} as Response,
      () => {},
      user1
    );

    console.log({ create });
  });
});
