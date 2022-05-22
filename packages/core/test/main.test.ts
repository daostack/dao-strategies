import {
    balancesToObject,
    StrategyComputation,
    WorldConfig,
} from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import 'dotenv/config';

let token: string | undefined;
let config: WorldConfig;
let strategyComp: StrategyComputation;

test('init', () => {
    token = process.env.GITHUB_TOKEN;
    if (token == undefined) {
        throw 'Github token not defined';
    }
    config = { GITHUB_TOKEN: token as string };
    strategyComp = new StrategyComputation(config);
});

test('basic test', async () => {
    const result = await strategyComp.runStrategy('GH_PRS_REACTIONS_WEIGHED', {
        repositories: [{ owner: 'gershido', repo: 'test-github-api' }],
        timeRange: { start: 1640998800, end: 1652437383 },
    });

    console.log(JSON.stringify(balancesToObject(result)));
    expect(balancesToObject(result)).toEqual({ "gershido": "1000000000000000000" });
});

//test('geth', async () => {
//    const result = await strategyComp.runStrategy('GH_PRS_REACTIONS_WEIGHED', {
//        repositories: [{ owner: 'ethereum', repo: 'go-ethereum' }],
//        timeRange: { start: 1641032578, end: 1653118615 },
//    });
//
//    console.log(JSON.stringify(balancesToObject(result)));
//});