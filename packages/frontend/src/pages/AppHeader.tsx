import { Box } from 'grommet';
import React, { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppButton } from '../components/styles/BasicElements';

import { useLoggedUser } from '../hooks/useLoggedUser';
import { RouteNames } from './MainPage';

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const AppHeader: FC<IMainPageHeaderProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { account, connect, startLogout } = useLoggedUser();

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
    <Link to="/">
      <Box pad="small">Storks</Box>
    </Link>
  );

  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10, zIndex: 1 }}>
      {account ? (
        <>
          <AppButton onClick={() => startLogout()}>Disconnect {account.slice(0, 8)}...</AppButton>
          <AppButton onClick={seeProfile}>{isProfile() ? 'Back' : 'Profile'}</AppButton>
        </>
      ) : (
        <AppButton primary onClick={connect}>
          Connect
        </AppButton>
      )}
    </div>
  );

  return (
    <Box direction="row" justify="between" pad="small">
      {left}
      {right}
    </Box>
  );
};
