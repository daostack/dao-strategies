import {
    balancesToObject,
    StrategyComputation,
    WorldConfig,
} from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import 'dotenv/config';

let token: string | undefined;

test('set token', () => {
    token = process.env.GITHUB_TOKEN;
    if (token == undefined) {
        throw 'Github token not defined';
    }
});

test('basic test', async () => {
    let config: WorldConfig = { GITHUB_TOKEN: token as string };
    let strategyComp = new StrategyComputation(config);

    const result = await strategyComp.runStrategy('GH_PRS_REACTIONS_WEIGHED', {
        repositories: [{ owner: 'gershido', repo: 'test-github-api' }],
        timeRange: { start: 1640998800, end: 1652437383 },
    });

    expect(balancesToObject(result)).toEqual({ "gershido": "1000000000000000000" });
});