import { CampaignUriDetails } from '@dao-strategies/core';
import { Response } from 'express';

import { CampaignController } from '../src/enpoints/CampaignController';
import { initServices } from '../src/init';
import { ExecuteService } from '../src/services/ExecutionService';
import { Services } from '../src/types';

describe('Test run', () => {
  let services: Services;
  let execution: ExecuteService;
  let campaign: CampaignController;

  beforeAll(() => {
    console.log('Initializing test');
    const context = initServices();
    services = context.services;
    execution = context.execution;

    console.log({ execution });
    campaign = new CampaignController(services);
  });

  test('Create campaign', async () => {
    const details: CampaignUriDetails = {
      creator: '',
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
    const result = await campaign.create(request, {} as Response, () => {}, '');
    console.log({ result });
  });
});
