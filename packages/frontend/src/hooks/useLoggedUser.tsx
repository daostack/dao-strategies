import { Signer } from 'ethers';
import { ReactNode, createContext, useContext, FC, useState } from 'react';
import { useAccount } from 'wagmi';
import { checkLoggedUser, signInWithEthereum } from '../utils/loggedUser';

export interface UserDetails {
  address: string;
  verified: {
    github: string;
  };
}

export type LoggedUserContextType = {
  account: string | undefined;
  user: UserDetails | undefined;
  checkAndLogin: (signer: Signer) => void;
};

const LoggedUserContextValue = createContext<LoggedUserContextType | undefined>(undefined);

export interface LoggedUserProviderProps {
  children: ReactNode;
}

export const LoggedUserContext: FC<LoggedUserProviderProps> = (props) => {
  const { data: account } = useAccount();
  const [user, setUser] = useState<UserDetails | undefined>(undefined);

  const checkAndLogin = async (signer: Signer) => {
    let userRead = await checkLoggedUser();
    if (userRead === undefined) {
      const address = await signer.getAddress();
      userRead = await signInWithEthereum(address, signer);
    }
    setUser(userRead);
  };

  return (
    <LoggedUserContextValue.Provider value={{ account: account?.address, checkAndLogin, user }}>
      {props.children}
    </LoggedUserContextValue.Provider>
  );
};

export function useLoggedUser(): LoggedUserContextType {
  const context = useContext(LoggedUserContextValue);
  if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
  return context;
}
