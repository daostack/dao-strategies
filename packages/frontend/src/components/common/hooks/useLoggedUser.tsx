import { ReactNode, createContext, useContext } from 'react';

export type LoggedUserContextType = {
  address: string;
};

const LoggedUserContext = createContext<LoggedUserContextType | undefined>(undefined);

export interface LoggedUserProviderProps {
  children: ReactNode;
}

export function LoggedUserReactProvider({ children }: LoggedUserProviderProps): JSX.Element {
  const address = useLoggedUser();
  return <LoggedUserContext.Provider value={{ address }}>{children}</LoggedUserContext.Provider>;
}

export function useLoggedUser(): LoggedUserContextType {
  const context = useContext(LoggedUserContext);
  if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
  return context;
}
