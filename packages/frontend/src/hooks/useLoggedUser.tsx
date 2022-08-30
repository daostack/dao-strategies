import { LoggedUserDetails, VerificationIntent } from '@dao-strategies/core';
import { InjectedConnector } from '@wagmi/core';
import { Signer } from 'ethers';
import { ReactNode, createContext, useContext, FC, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { checkLoggedUser, logout, signInWithEthereum } from '../utils/loggedUser';

export type LoggedUserContextType = {
  account: string | undefined;
  user: LoggedUserDetails | undefined;
  githubAccount: string | undefined;
  checkAndLogin: (signer: Signer) => Promise<void>;
  connect: () => Promise<void>;
  startLogout: () => Promise<void>;
  refresh: () => Promise<void>;
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

  const { address, isConnecting } = useAccount();
  const [user, setUser] = useState<LoggedUserDetails | undefined>(undefined);

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
    try {
      const connectResult = await connectHook.connectAsync();

      if (connectResult.connector != null) {
        const signer = await connectResult.connector.getSigner();
        checkAndLogin(signer);
      }
    } catch (e) {
      disconnect();
    }
  };

  useEffect(() => {
    if (!isConnecting && address) {
      /** automatically logout if the account changed */
      if (user && user.address !== address) {
        startLogout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnecting]);

  /** the connected account is the connected metamask user and the read user from the backend (obtained by
   * signing the siwe) */
  const accountAddress =
    address !== undefined && user !== undefined
      ? address?.toLowerCase() === user.address.toLowerCase()
        ? address
        : undefined
      : undefined;

  /**
   * for exernal accounts that are logged we consider the account verified if they have already
   * had a github account that setup them as the target of rewards
   */
  const verification =
    user && accountAddress
      ? user.verifications.find((v) => v.intent === VerificationIntent.SEND_REWARDS || v.to.endsWith(accountAddress))
      : undefined;

  return (
    <LoggedUserContextValue.Provider
      value={{
        account: accountAddress,
        githubAccount: verification ? verification.from : undefined,
        checkAndLogin,
        user,
        connect,
        startLogout,
        refresh,
      }}>
      {props.children}
    </LoggedUserContextValue.Provider>
  );
};

export function useLoggedUser(): LoggedUserContextType {
  const context = useContext(LoggedUserContextValue);
  if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
  return context;
}
