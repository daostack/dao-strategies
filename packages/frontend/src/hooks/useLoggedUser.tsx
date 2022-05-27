import { InjectedConnector } from '@wagmi/core';
import { Signer } from 'ethers';
import { ReactNode, createContext, useContext, FC, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSigner } from 'wagmi';
import { checkLoggedUser, logout, signInWithEthereum } from '../utils/loggedUser';

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
  connect: () => void;
  startLogout: () => void;
  refresh: () => void;
};

const LoggedUserContextValue = createContext<LoggedUserContextType | undefined>(undefined);

export interface LoggedUserProviderProps {
  children: ReactNode;
}

export const LoggedUserContext: FC<LoggedUserProviderProps> = (props) => {
  const connectHook = useConnect({
    connector: new InjectedConnector(),
  });

  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();

  const { data: account, isFetching } = useAccount();
  const [user, setUser] = useState<UserDetails | undefined>(undefined);

  const checkAndLogin = async (signer: Signer) => {
    let userRead = await checkLoggedUser();
    if (userRead === undefined) {
      const address = await signer.getAddress();
      try {
        userRead = await signInWithEthereum(address, signer);
        if (userRead === undefined) {
          startLogout();
        }
      } catch (e) {
        startLogout();
      }
    }
    setUser(userRead);
  };

  const refresh = async () => {
    let userRead = await checkLoggedUser();
    setUser(userRead);
  };

  const startLogout = async () => {
    /** destroy session */
    await logout();
    /** disconnect */
    disconnect();
    /** clear user details */
    setUser(undefined);
  };

  // ISSUE WITH AUTO-RECONNECT
  // const reconnect = async () => {
  //   await startLogout();
  //   if (signer) {
  //     checkAndLogin(signer);
  //   }
  // };

  const connect = async () => {
    const connectResult = await connectHook.connectAsync();
    if (connectResult.connector != null) {
      const signer = await connectResult.connector.getSigner();
      checkAndLogin(signer);
    }
  };

  useEffect(() => {
    if (!isFetching && account != null) {
      /** automatically logout if the account changed */
      if (user && user.address !== account.address) {
        startLogout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isFetching]);

  return (
    <LoggedUserContextValue.Provider
      value={{ account: account?.address, checkAndLogin, user, connect, startLogout, refresh }}>
      {props.children}
    </LoggedUserContextValue.Provider>
  );
};

export function useLoggedUser(): LoggedUserContextType {
  const context = useContext(LoggedUserContextValue);
  if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
  return context;
}