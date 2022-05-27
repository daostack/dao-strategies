import { InjectedConnector } from '@wagmi/core';
import { Button, PageHeader } from 'antd';
import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConnect } from 'wagmi';

import { useLoggedUser } from '../hooks/useLoggedUser';
import { RouteNames } from './MainPage';

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const connectHook = useConnect({
    connector: new InjectedConnector(),
  });
  const navigate = useNavigate();
  const location = useLocation();

  const { checkAndLogin, account } = useLoggedUser();

  const connect = async () => {
    const connectResult = await connectHook.connectAsync();
    if (connectResult.connector != null) {
      const signer = await connectResult.connector.getSigner();
      checkAndLogin(signer);
    }
  };

  const seeProfile = () => {
    if (isProfile()) {
      navigate(RouteNames.Base);
    } else {
      navigate(RouteNames.Profile);
    }
  };

  const isProfile = () => {
    return location.pathname === RouteNames.Profile;
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
      {account ? (
        <Button onClick={seeProfile}>{isProfile() ? 'Back' : 'Profile'}</Button>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
    </div>
  );

  return (
    <>
      {left}
      {right}
    </>
  );
};
