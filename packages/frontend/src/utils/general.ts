import { TokenBalance } from '@dao-strategies/core';

export function toTimestamp(date: string): number {
  return Math.round(new Date(date).getTime() / 1000);
}

export function valueToString(number: number, decimals: number = 3) {
  return number.toPrecision(Math.floor(number).toString().length + decimals);
}

export const toBase64 = async (file: File): Promise<string | undefined> => {
  let result_base64 = await new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onload = (e) => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });
  return result_base64?.toString();
};

export const hasAssets = (assets: TokenBalance[]): boolean => {
  return assets.find((asset) => asset.balance !== '0') !== undefined;
};
