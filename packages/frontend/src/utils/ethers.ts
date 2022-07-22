import { BigNumber, ethers } from 'ethers';

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}

export const formatEther = (wei: string | BigNumber, decimals: number = 4) => {
  const str = ethers.utils.formatEther(wei).toString();
  return truncate(str, decimals);
};
