import {
  balancesToObject,
  StrategyComputation,
  WorldConfig,
} from '@dao-strategies/core';

import 'dotenv/config';

async function runTest() {
  let token = process.env.GITHUB_TOKEN;
  if (token == undefined) {
    throw 'Github token not defined';
  }
  console.log('token:', token);

  let config: WorldConfig = { GITHUB_TOKEN: token };
  let strategyComp = new StrategyComputation(config);

  const result = await strategyComp.runStrategy('GH_PRS_REACTIONS_WEIGHED', {
    repositories: [{ owner: 'ethereum', repo: 'go-ethereum' }],
    timeRange: { start: 1640998800, end: 1652437383 },
  });

  console.log(JSON.stringify(balancesToObject(result)));
}

runTest();
