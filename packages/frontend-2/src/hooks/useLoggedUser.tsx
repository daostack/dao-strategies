import { Signer } from 'ethers';
import { ReactNode, createContext, useContext, FC } from 'react';
import { useAccount } from 'wagmi';
import { checkLoggedUser, signInWithEthereum } from '../utils/loggedUser';

export type LoggedUserContextType = {
  address: string | undefined;
  checkLogin: (signer: Signer) => void;
};

const LoggedUserContextValue = createContext<LoggedUserContextType | undefined>(undefined);

export interface LoggedUserProviderProps {
  children: ReactNode;
}

export const LoggedUserContext: FC<LoggedUserProviderProps> = (props) => {
  const { data: account } = useAccount();

  const checkLogin = async (signer: Signer) => {
    const address = await checkLoggedUser();
    if (address === undefined) {
      const address = await signer.getAddress();
      signInWithEthereum(address, signer);
    }
  };

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
