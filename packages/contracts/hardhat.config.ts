/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

import { BigNumber, Signer, utils } from 'ethers';

import '@typechain/hardhat';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@tenderly/hardhat-tenderly';
import 'hardhat-deploy';
import 'solidity-coverage';
import "hardhat-gas-reporter";

import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';

import { Provider, TransactionRequest, TransactionResponse } from '@ethersproject/providers';

import { HardhatUserConfig, task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types';
import { THardhatDeployEthers } from 'helpers/types/hardhat-type-extensions';
import { create } from 'ipfs-http-client';

import { config as envConfig } from 'dotenv';
envConfig({ path: '../frontend/.env' });

/**
 * Set your target network!!!
 */
console.log('HARDHAT_TARGET_NETWORK: ', process.env.HARDHAT_TARGET_NETWORK);

const { isAddress, getAddress, formatUnits, parseUnits } = utils;
//
// Select the network you want to deploy to here:
//

const mnemonicPath = './generated/mnemonic.secret';
const getMnemonic = (): string => {
  try {
    return fs.readFileSync(mnemonicPath).toString().trim();
  } catch (e) {
    if (process.env.HARDHAT_TARGET_NETWORK !== 'localhost') {
      console.log('☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.');
    }
  }
  return '';
};

const config: HardhatUserConfig = {
  defaultNetwork: process.env.HARDHAT_TARGET_NETWORK,
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: {
    hardhat: {
      /*
        if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: './typechain',
  },
};
export default config;

const DEBUG = false;

function debug(text: string): void {
  if (DEBUG) {
    console.log(text);
  }
}

async function send(signer: Signer, txparams: any): Promise<TransactionResponse> {
  return await signer.sendTransaction(txparams);
}

task('wallet', 'Create a wallet (pk) link', async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom();
  const { privateKey } = randomWallet._signingKey();
  console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
  console.log(`🔗 http://localhost:3000/pk#${privateKey}`);
});

task('txEvents', 'Get tx receipt')
  .addParam('txhash', 'Transaction hash')
  .setAction(async (taskArgs: { txhash: string }, hre) => {
    const { ethers } = hre;

    const txReceipt = await ethers.provider.getTransactionReceipt(taskArgs.txhash);
    console.log(txReceipt);
  });
