import { TokenBalance } from '@dao-strategies/core';
import { useCallback, useEffect, useState } from 'react';
import { ORACLE_NODE_URL } from '../config/appConfig';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useBalanceOf(
  asset?: string,
  chainId?: number,
  account?: string
): { balance?: TokenBalance; isLoading: boolean } {
  const [balance, setBalance] = useState<TokenBalance>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const get = useCallback(async () => {
    if (asset !== undefined && chainId !== undefined && account !== undefined) {
      setIsLoading(true);
      const response = await fetch(ORACLE_NODE_URL + `/onchain/balanceOf/${chainId}/${asset}/${account}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const balance: TokenBalance = await response.json();
      setBalance(balance);
      setIsLoading(false);
    }
  }, [asset, chainId, account]);

  useEffect(() => {
    void get();
  }, [asset, chainId, account]);

  return {
    balance,
    isLoading,
  };
}
