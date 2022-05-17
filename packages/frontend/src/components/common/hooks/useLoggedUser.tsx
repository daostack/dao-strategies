import { useEthersContext } from 'eth-hooks/context';
import { ReactNode, createContext, useContext, FC } from 'react';

export type LoggedUserContextType = {
  address: string | undefined;
};

const LoggedUserContextValue = createContext<LoggedUserContextType | undefined>(undefined);

export interface LoggedUserProviderProps {
  children: ReactNode;
}

export const LoggedUserContext: FC<LoggedUserProviderProps> = (props) => {
  const ethersContext = useEthersContext();
  return (
    <LoggedUserContextValue.Provider value={{ address: ethersContext.account }}>
      {props.children}
    </LoggedUserContextValue.Provider>
  );
};

export function useLoggedUser(): LoggedUserContextType {
  const context = useContext(LoggedUserContextValue);
  if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
  return context;
}
