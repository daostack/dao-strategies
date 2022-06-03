import { CampaignUriDetails } from '@dao-strategies/core';
import { Response } from 'express';

import { CampaignController } from '../src/enpoints/CampaignController';
import { ServiceManager } from '../src/service.manager';
import { CampaignCreateDetails } from '../src/services/types';
import { TimeService } from '../src/services/TimeService';

import { StrategyComputationMockFunctions } from './modules-mocks/strategy.computation';

jest.mock('../src/services/TimeService');

/** Mock the strategy computation */
/* eslint-disable */
jest.mock('@dao-strategies/core', () => {
  const originalModule = jest.requireActual('@dao-strategies/core');

  return {
    __esModule: true,
    ...originalModule,
    StrategyComputation: jest.fn(function (): any {
      return StrategyComputationMockFunctions;
    }),
  };
});
/* eslint-enable */

describe('start', () => {
  let manager: ServiceManager;
  let campaign: CampaignController;

  const user0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const user1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const user2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
  // const user3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
  // const user4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65';
  const user5 = '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc';

  const creator = user0;

  beforeAll(async () => {
    manager = new ServiceManager();
    campaign = new CampaignController(manager.services);

    console.log({ now: manager.services.time.now() });

    await manager.resetDB();

    await manager.services.user.getOrCreate({
      address: creator,
    });
  });

  describe('simulate retro', () => {
    let create;

    beforeEach(async () => {
      const details: CampaignUriDetails = {
        creator: creator,
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
      create = await campaign.simulateFromDetails(
        request,
        {} as Response,
        () => {},
        creator
      );
    });

    test('valid simulate', () => {
      console.log({ create });
    });

    describe('register retro', () => {
      let register;

      beforeEach(async () => {
        const uri = create.uri;
        const details: CampaignCreateDetails = {
          address: user5,
          cancelDate: 0,
          description: '',
          guardian: user1,
          oracle: user2,
          registered: true,
          title: 'title',
        };

        const request = {
          params: { uri },
          body: details,
        };

        register = await campaign.register(
          request,
          {} as Response,
          () => {},
          user0
        );
      });

      test('valid registered', () => {
        console.log({ register });
      });
    });
  });
});
