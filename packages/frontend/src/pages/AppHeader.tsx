import { Box, CheckBox } from 'grommet';
import { Moon } from 'grommet-icons';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { LoggedUser } from '../components/LoggedUser';
import { Logo } from '../components/Logo';
import { useThemeContext } from '../ThemedApp';

export const HEADER_HEIGHT = 80;

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const AppHeader: FC<IMainPageHeaderProps> = (props) => {
  const { setTheme } = useThemeContext();

  const left = (
    <Link to="/">
      <Logo></Logo>
    </Link>
  );

  const right = (
    <Box direction="row" align="center">
      <Box style={{ marginRight: '24px' }} direction="row" align="center">
        <CheckBox toggle onChange={(event) => setTheme(event.target.checked)}></CheckBox>
        <Moon style={{ marginLeft: '6px' }}></Moon>
      </Box>
      <LoggedUser></LoggedUser>
    </Box>
  );

  return (
    <Box
      style={{ position: 'fixed', zIndex: '100', width: '100vw', height: `${HEADER_HEIGHT}px`, padding: '0px 32px' }}
      direction="row"
      justify="between"
      align="center">
      {left}
      {right}
    </Box>
  );
};
