import { Button, PageHeader } from 'antd';
import { useEthersContext } from 'eth-hooks/context';
import { FC, useEffect } from 'react';

import { useScaffoldProviders } from './hooks/useScaffoldAppProviders';

export interface IMainPageHeaderProps {
  dum?: any;
}

export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const ethersContext = useEthersContext();
  const providers = useScaffoldProviders();
  const connector = providers.createLoginConnector();

  const connect = (): void => {
    if (connector) {
      ethersContext.openModal(connector);
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
      {ethersContext.active ? ethersContext.account : <Button onClick={connect}>Connect</Button>}
    </div>
  );

  return (
    <>
      {left}
      {right}
    </>
  );
};
