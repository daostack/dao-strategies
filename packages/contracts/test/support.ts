import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

export const numOf = (str: string): string => {
  return str.replace(/\s/g, '');
};

export const toWei = (str: string): BigNumber => {
  return ethers.utils.parseEther(numOf(str));
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const shouldFail = async (fun: Function): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  await new Promise<void>(async (resolve, reject): Promise<void> => {
    try {
      await fun();
    } catch (e) {
      resolve();
    }
    reject('function execution did not failed');
  });
};

export async function getTimestamp(block?: string): Promise<BigNumber> {
  return ethers.BigNumber.from((await ethers.provider.getBlock(block == undefined ? 'latest' : block)).timestamp);
}

export async function fastForwardFromBlock(block: string, seconds: BigNumber): Promise<void> {
  const now = await getTimestamp();
  const timeSinceTimemark = now.sub(await getTimestamp(block));
  const fastforwardAmount = seconds.sub(timeSinceTimemark);
  await ethers.provider.send('evm_increaseTime', [fastforwardAmount.toNumber()]);
  await ethers.provider.send('evm_mine', []);
}

export async function fastForwardToTimestamp(toTimestamp: BigNumber): Promise<void> {
  const now = await getTimestamp();
  const fastforwardAmount = toTimestamp.sub(now);
  await ethers.provider.send('evm_increaseTime', [fastforwardAmount.toNumber()]);
  await ethers.provider.send('evm_mine', []);
}
