import { BigNumber } from 'ethers';

import { Balances, BalancesFloat } from '../types';

export interface BalancesObject {
  [account: string]: string;
}

export const balancesToObject = (balances: Balances): BalancesObject => {
  const balancesObject: BalancesObject = {};
  balances.forEach(
    (balance, account) => (balancesObject[account] = balance.toString())
  );
  return balancesObject;
};

const zerosStr = (n: number): string => {
  return '0'.repeat(n);
};

/* need to check a different conversion method because toPrecision can return exponential notation:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision*/
const floatToBN = (amount: number, nDecimals: number = 18): BigNumber => {
  /** use string to convert from float to (large) integer */
  const [wholeStr, decimalsStr] = amount.toPrecision(64).split('.');
  const whole = BigNumber.from(wholeStr + zerosStr(18));
  const decimals = BigNumber.from(
    decimalsStr.length >= nDecimals
      ? decimalsStr.substring(0, nDecimals)
      : decimalsStr + zerosStr(nDecimals - decimalsStr.length)
  );
  return whole.add(decimals);
};

export const BNToFloat = (bn: BigNumber, decimals: number): number => {
  // use string and insert dot in the decimal position
  const str = bn.toString();

  const decimalsStr =
    str.length > decimals
      ? str.slice(str.length - decimals, str.length)
      : '0'.repeat(decimals - str.length).concat(str);

  const wholeStr =
    str.length > decimals ? str.slice(0, str.length - decimals) : '0';

  return Number.parseFloat(`${wholeStr}.${decimalsStr}`);
};

/** float numbers are converted to big integers (where 1E+18 = 1.0)
 * and the set is scaled so that the sum of all the balances = 1E+18,
 * there **most likely will be** rounding errors in the conversion */
export const normalizeRewards = (balancesFloat: BalancesFloat): Balances => {
  const balances: Balances = new Map();

  if (balancesFloat.size > 0) {
    /** Sum using floating numbers */
    const sum = Array.from(balancesFloat.values()).reduce(
      // eslint-disable-next-line no-param-reassign
      (sum, amount) => (sum += amount),
      0
    );

    /** convert to BigNumber with 18 decimals */
    let sumBN = BigNumber.from(0);
    let oneAccount: string | undefined = undefined;

    balancesFloat.forEach((amount, account) => {
      /** store one account to recice the residuals (avoids spreading the Map later) */
      if (oneAccount === undefined) {
        oneAccount = account;
      }
      const amountNormalized = amount / sum;
      const amountBN = floatToBN(amountNormalized);
      balances.set(account, amountBN);
      sumBN = sumBN.add(amountBN);
    });

    /** Round the balance to force exact sum of all balances is 1E18 */
    if (oneAccount !== undefined) {
      /** numerical error (should be small) */
      const oneAccountBal = balances.get(oneAccount);
      if (oneAccountBal === undefined)
        throw new Error('unexpected balance for account');
      if (sumBN.lt(BigNumber.from('1000000000000000000'))) {
        balances.set(
          oneAccount,
          oneAccountBal.add(BigNumber.from('1000000000000000000').sub(sumBN))
        );
      } else {
        balances.set(
          oneAccount,
          oneAccountBal.sub(sumBN.sub(BigNumber.from('1000000000000000000')))
        );
      }
    }
  }

  return balances;
};

export const bigIntToNumber = (
  bn: bigint | null | undefined
): number | undefined => {
  if (bn === undefined || bn == null) {
    return undefined;
  }
  if (bn > Number.MAX_SAFE_INTEGER) {
    return NaN;
  }
  return Number(bn);
};

export const bigNumberToNumber = (
  bn: BigNumber | undefined
): number | undefined => {
  if (bn === undefined || bn == null) {
    return undefined;
  }
  if (bn.gt(BigNumber.from(Number.MAX_SAFE_INTEGER.toString()))) {
    return NaN;
  }
  return Number(bn);
};
