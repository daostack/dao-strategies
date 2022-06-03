import { CampaignUriDetails } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import { Response } from 'express';

import { CampaignController } from '../src/enpoints/CampaignController';
import { ServiceManager } from '../src/service.manager';
import { CampaignCreateDetails } from '../src/services/types';
import { toNumber } from '../src/utils/utils';

import {
  StrategyComputationMockFunctions,
  TEST_REWARDS,
} from './mocks/strategy.computation';
import { months } from './utils';

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

jest.mock('../src/services/TimeService', () => {
  return {
    TimeService: jest.fn(() => {
      console.log('Initializing');
      let _now = 0;

      return {
        now: (): number => {
          return _now;
        },

        set: (n: number): void => {
          _now = n;
        },

        advance: (n: number): void => {
          _now += n;
        },
      };
    }),
  };
});

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

    await manager.resetDB();

    await manager.services.user.getOrCreate({
      address: creator,
    });
  });

  describe('simulate retro', () => {
    const simDate = 1650000000;
    let create;
    let uri: string;

    beforeAll(async () => {
      /* eslint-disable */
      (manager.services.time as any).set(simDate);
      /* eslint-enable */

      const end = simDate - months(1);

      const details: CampaignUriDetails = {
        creator: creator,
        execDate: end,
        nonce: 0,
        strategyID: 'GH_PRS_REACTIONS_WEIGHED',
        strategyParams: {
          repositories: [{ owner: 'gershido', repo: 'test-github-api' }],
          timeRange: {
            start: simDate - months(4),
            end,
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

      uri = create.uri;
    });

    test('is simulated', async () => {
      const campaign = await manager.services.campaign.get(uri);

      expect(campaign.executed).toBe(false);
      expect(toNumber(campaign.lastRunDate)).toBe(manager.services.time.now());
      expect(campaign.uri).toHaveLength(61);

      const rewards = await manager.services.campaign.getRewards(uri);

      const test_receivers = Object.getOwnPropertyNames(TEST_REWARDS);
      expect(rewards.size).toBe(test_receivers.length);

      test_receivers.forEach((user: string) => {
        expect(rewards.get(user).eq(TEST_REWARDS[user] as BigNumber)).toBe(
          true
        );
      });
    });

    describe('register retro', () => {
      let register;

      beforeAll(async () => {
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

      test('is registered', () => {});

      describe('execute', () => {
        beforeAll(async () => {
          await manager.execution.checkIncoming();
        });

        test('is executed', async () => {
          const campaign = await manager.services.campaign.get(uri);
          expect(campaign.executed).toBe(true);
        });
      });
    });
  });
});
