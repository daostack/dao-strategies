import { InjectedConnector } from '@wagmi/core';
import { Button, PageHeader } from 'antd';
import React, { FC } from 'react';
import { useAccount, useConnect } from 'wagmi';

import { useLoggedUser } from '../hooks/useLoggedUser';

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const accountHook = useAccount();
  const connectHook = useConnect({
    connector: new InjectedConnector(),
  });

  const { checkLogin } = useLoggedUser();

  const connect = async () => {
    const connectResult = await connectHook.connectAsync();
    if (connectResult.connector != null) {
      const signer = await connectResult.connector.getSigner();
      checkLogin(signer);
    }
  };

  const left = (
    <>
      <div>
        <PageHeader title="DAO-Strategies" />
      </div>
      {props.children}
    </>
  );

  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10, zIndex: 1 }}>
      {accountHook && accountHook.data ? accountHook.data.address : <Button onClick={connect}>Connect</Button>}
    </div>
  );

  return (
    <>
      {left}
      {right}
    </>
  );
};
