import { client } from '@wagmi/core/dist/declarations/src/client';
import { ReactNode, createContext, useContext, FC, useState } from 'react';
import { useAccount } from 'wagmi';
import { useLocalStorage } from './useLocalStorage';

export type LoggedUserContextType = {
  address: string | undefined;
  checkLogin: () => void
};

const LoggedUserContextValue = createContext<LoggedUserContextType | undefined>(undefined);

export interface LoggedUserProviderProps {
  children: ReactNode;
}

export const LoggedUserContext: FC<LoggedUserProviderProps> = (props) => {
  const { data: account } = useAccount()
  
  const checkLogin = () => {
    const isLogged = useLocalStorage('');
    
    if (isLogged) {
      fetch('http:nonce', {}).then((response) => {
        client.sign().then(
          fetch('http:isvalid').then()
        )
      })
    }
  }
  return (
    <LoggedUserContextValue.Provider value={{ address: account?.address, checkLogin }}>
      {props.children}
    </LoggedUserContextValue.Provider>
  );
};

export function useLoggedUser(): LoggedUserContextType {
  const context = useContext(LoggedUserContextValue);
  if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
  return context;
}
