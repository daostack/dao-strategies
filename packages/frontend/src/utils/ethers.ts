import { TokenBalance } from '@dao-strategies/core';
import { BigNumber, ethers } from 'ethers';

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}

export const formatEther = (wei: string | BigNumber | number, decimals: number = 4) => {
  const str = ethers.utils.formatEther(wei).toString();
  return truncate(str, decimals);
};

export const assetValue = (token: TokenBalance, ratio: number = 1, decimals: number = 4): string => {
  const value =
    token.price !== undefined
      ? +ethers.utils.formatUnits(token.balance, token.decimals) * token.price * ratio
      : undefined;
  return value !== undefined ? truncate(value.toString(), decimals) : '--';
};
