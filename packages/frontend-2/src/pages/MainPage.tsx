import { InjectedConnector } from '@wagmi/core';
import { FC } from 'react';
import { useAccount, useConnect, useSigner } from 'wagmi';
import { useLoggedUser } from '../hooks/useLoggedUser';

export const MainPage: FC = () => {
  const accountHook = useAccount();
  const { checkLogin } = useLoggedUser();

  const connectHook = useConnect({
    connector: new InjectedConnector(),
  });

  const connect = async () => {
    const connectResult = await connectHook.connectAsync();
    if (connectResult.connector != null) {
      const signer = await connectResult.connector.getSigner();
      checkLogin(signer);
    }
  };

  if (accountHook && accountHook.data) return <div>Connected to {accountHook.data.address}</div>;
  return <button onClick={() => connect()}>Connect Wallet</button>;
};
