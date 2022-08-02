import { Box } from 'grommet';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { LoggedUser } from '../components/LoggedUser';
import { Logo } from '../components/Logo';

export const HEADER_HEIGHT = 80;

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const AppHeader: FC<IMainPageHeaderProps> = (props) => {
  const left = (
    <Link to="/">
      <Logo></Logo>
    </Link>
  );

  const right = <LoggedUser></LoggedUser>;

  return (
    <Box
      style={{ position: 'absolute', width: '100vw', height: `${HEADER_HEIGHT}px`, padding: '0px 32px' }}
      direction="row"
      justify="between"
      align="center">
      {left}
      {right}
    </Box>
  );
};
