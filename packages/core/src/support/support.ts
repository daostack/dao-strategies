import { Balances } from '~~/types';

export interface BalancesObject {
  [account: string]: string;
}

export const balancesToObject = (
  balances: Balances
): { [account: string]: string } => {
  const balancesObject: BalancesObject = {};
  balances.forEach(
    (balance, account) => (balancesObject[account] = balance.toString())
  );
  return balancesObject;
};
