import {
    balancesToObject,
    StrategyComputation,
    WorldConfig,
    strategies
} from '@dao-strategies/core';
import type { Strategy_ID, Balances } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import 'dotenv/config';
import { performance } from 'perf_hooks';


const strategyName = (process.argv.find((arg) => arg.includes('--strategy=')) || '--strategy=GH_PRS_REACTIONS_WEIGHED').split('--strategy=').pop();
if (strategyName == undefined) {
    throw new Error("Error: strategy name is undefined");
}

describe(`\nTest strategy "${strategyName}"`, () => {

    let token: string | undefined;
    let config: WorldConfig;
    let strategyComp: StrategyComputation;
    let shares: Balances;

    test('init', () => {
        token = process.env.GITHUB_TOKEN;
        if (token == undefined) {
            throw 'Github token not defined';
        }
        config = { GITHUB_TOKEN: token as string };
        strategyComp = new StrategyComputation(config);
    });

    test('run strategy', async () => {
        shares = await strategyComp.runStrategy(
            strategyName as Strategy_ID,
            strategies[strategyName as Strategy_ID].strategyInfo.exapmle_Params
        );

        console.log(JSON.stringify(balancesToObject(shares)));
    }, 360e3);

    test('check sum of shares equals 1e18', () => {
        let sum: BigNumber = BigNumber.from(0);
        for (let amount of shares.values()) {
            sum = sum.add(amount);
        }

        expect(sum.eq(BigNumber.from("1000000000000000000"))).toEqual(true);
    });
});