import { CampaignUriDetails, getAddressStrict } from '@dao-strategies/core';
import { BigNumber, Contract, ContractInterface, ethers } from 'ethers';
import { Response } from 'express';
import { CID } from 'multiformats';
import { base32 } from 'multiformats/bases/base32';

import { CampaignController } from '../src/enpoints/CampaignController';
import hardhatContractsJson from '../src/generated/hardhat_contracts.json';
import { Campaign } from '../src/generated/typechain';
import { ServiceManager } from '../src/service.manager';
import { ExecutionConfig } from '../src/services/ExecutionService';
import { CampaignCreateDetails } from '../src/services/types';
import { toNumber } from '../src/utils/utils';

import {
  StrategyComputationMockFunctions,
  TEST_SHARES,
} from './mocks/strategy.computation';
import { months } from './utils';

/* eslint-disable */
const CampaignJson: any = (hardhatContractsJson as any)['1337']['localhost'][
  'contracts'
]['Campaign'];
/* eslint-enable */

const ZERO_BYTES32 = '0x' + '0'.repeat(64);

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
      };
    }),
  };
});

describe('start', () => {
  let manager: ServiceManager;
  let campaignController: CampaignController;

  const user0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const user1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const user2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
  // const user3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
  // const user4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65';
  // const user5 = '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc';

  const creator = user0;
  const oracle = user1;
  const guardian = user2;

  const now = new Date();
  const seed = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(now.toUTCString()))
  );
  const PERIOD_CHECK = 2; // >= 2

  beforeAll(async () => {
    const config: ExecutionConfig = {
      enabled: false,
      periodCheck: PERIOD_CHECK,
    };
    manager = new ServiceManager(config);
    campaignController = new CampaignController(manager.services);

    await manager.resetDB();

    const block = await manager.services.onchain.provider.getBlockNumber();
    console.log({ block });

    await manager.services.user.getOrCreate({
      address: creator,
    });
  });

  describe('simulate retro', () => {
    const simDate = 1650000000;
    let create;
    let uri: string;
    let uriCid: CID;

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
      create = await campaignController.simulateFromDetails(
        request,
        {} as Response,
        () => {},
        creator
      );

      uri = create.uri;
      uriCid = CID.parse(uri, base32);
    });

    test('is simulated', async () => {
      const campaign = await manager.services.campaign.get(uri);

      expect(campaign.executed).toBe(false);
      expect(toNumber(campaign.lastRunDate)).toBe(manager.services.time.now());
      expect(campaign.uri).toHaveLength(61);

      const shares = await manager.services.campaign.getSharesPaginated(uri);

      const test_receivers = Object.getOwnPropertyNames(TEST_SHARES);
      expect(shares.size).toBe(test_receivers.length);

      test_receivers.forEach((user: string) => {
        expect(shares.get(user).eq(TEST_SHARES[user] as BigNumber)).toBe(true);
      });
    });

    describe('register retro', () => {
      let address: string;
      const shares: Campaign.SharesDataStruct = {
        sharesMerkleRoot: ZERO_BYTES32,
        totalShares: BigNumber.from(0),
      };

      beforeAll(async () => {
        const details: CampaignCreateDetails = {
          address: '',
          cancelDate: 0,
          description: '',
          guardian,
          oracle,
          registered: true,
          title: 'title',
        };

        address = await manager.services.onchain.deploy(
          uri,
          shares,
          details,
          seed
        );
        details.address = address;

        const request = {
          params: { uri },
          body: details,
        };

        await campaignController.register(
          request,
          {} as Response,
          () => {},
          user1
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

  describe.only('create future', () => {
    const simDate = 1650000000;
    let create;
    let uri: string;
    let uriCid: CID;

    beforeAll(async () => {
      /* eslint-disable */
      (manager.services.time as any).set(simDate);
      /* eslint-enable */

      const end = simDate + months(4);

      const details: CampaignUriDetails = {
        creator: creator,
        execDate: end,
        nonce: 0,
        strategyID: 'GH_PRS_REACTIONS_WEIGHED',
        strategyParams: {
          repositories: [{ owner: 'gershido', repo: 'test-github-api' }],
          timeRange: {
            start: simDate + months(1),
            end,
          },
        },
      };

      const request: any = {
        body: {
          details,
        },
      };
      create = await campaignController.create(
        request,
        {} as Response,
        () => {},
        creator
      );

      /* eslint-disable */
      uri = create.uri;
      uriCid = CID.parse(uri, base32);
      /* eslint-enable */
    });

    test('is not simulated', async () => {
      const campaign = await manager.services.campaign.get(uri);

      expect(campaign.executed).toBe(false);
      expect(campaign.registered).toBe(false);
      expect(campaign.lastRunDate).toBeNull();

      const shares = await manager.services.campaign.getSharesPaginated(uri);

      expect(shares.size).toBe(0);
    });

    describe('register future', () => {
      let address: string;
      let campaignContract: Campaign;
      const shares: Campaign.SharesDataStruct = {
        sharesMerkleRoot: ZERO_BYTES32,
        totalShares: BigNumber.from(0),
      };

      beforeAll(async () => {
        const details: CampaignCreateDetails = {
          address: '',
          cancelDate: 0,
          description: '',
          guardian,
          oracle,
          registered: true,
          title: 'title',
        };

        address = await manager.services.onchain.deploy(
          uri,
          shares,
          details,
          seed
        );

        details.address = address;
        campaignContract = new Contract(
          address,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          CampaignJson.abi as ContractInterface,
          manager.services.onchain.provider
        ) as Campaign;

        const request = {
          params: { uri },
          body: details,
        };

        await campaignController.register(
          request,
          {} as Response,
          () => {},
          user1
        );
      });

      test('is registered', async () => {
        const campaign = await manager.services.campaign.get(uri);
        expect(campaign.registered).toBe(true);

        const read = {
          guardian: await campaignContract.guardian(),
          oracle: await campaignContract.oracle(),
          uri: await campaignContract.uri(),
          root: await campaignContract.shares(),
        };

        expect(getAddressStrict(read.guardian)).toBe(
          getAddressStrict(guardian)
        );
        expect(getAddressStrict(read.oracle)).toBe(getAddressStrict(oracle));
        expect(read.root.sharesMerkleRoot).toBe(ZERO_BYTES32);
        expect(read.root.totalShares.eq(BigNumber.from(0))).toBe(true);
        expect(ethers.utils.arrayify(read.uri)).toStrictEqual(
          uriCid.multihash.digest
        );
      });

      describe('try execute', () => {
        beforeAll(async () => {
          await manager.execution.checkIncoming();
        });

        test('is not executed', async () => {
          const campaign = await manager.services.campaign.get(uri);
          expect(campaign.executed).toBe(false);
        });

        describe('retry execute', () => {
          beforeAll(async () => {
            /** move time to 25 seconds before the schedulled execution time  */
            /* eslint-disable */
            (manager.services.time as any).set(
              simDate + months(4) - (PERIOD_CHECK - 1)
            );
            /* eslint-enable */

            /** then check incoming, this should set a timeout to run the execution
             * in about 25 seconds */
            await manager.execution.checkIncoming();
          });

          test(
            'is executed after timeout',
            async () => {
              expect(manager.execution.running.has(uri)).toBe(true);

              const campaign = await manager.services.campaign.get(uri);
              expect(campaign.executed).toBe(false);

              /** wait for the campaign to be executed */
              await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

              const campaign2 = await manager.services.campaign.get(uri);

              expect(manager.execution.running.has(uri)).toBe(false);
              expect(campaign2.executed).toBe(true);
            },
            3 * 1000
          );

          test('smart contract has root set', () => {});
        });
      });
    });
  });
});
