import { Box, CheckBox } from 'grommet';
import { Moon } from 'grommet-icons';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedUser } from '../components/LoggedUser';
import { Logo } from '../components/Logo';
import { styleConstants } from '../components/styles/themes';
import { useThemeContext } from '../ThemedApp';

export const HEADER_HEIGHT = 96;

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const AppHeader: FC<IMainPageHeaderProps> = (props) => {
  const { setTheme } = useThemeContext();
  const navigate = useNavigate();

  const left = <Logo onClick={() => navigate('/')}></Logo>;

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
      style={{
        position: 'absolute',
        width: '100vw',
        height: `${HEADER_HEIGHT}px`,
        padding: '0px 32px',
        backgroundColor: styleConstants.colors.whiteElements,
        boxShadow: '0px 1.63701px 24.5552px rgba(0, 0, 0, 0.08)',
      }}
      direction="row"
      justify="center">
      <Box style={{ width: '100%', maxWidth: '1200px' }} direction="row" justify="between" align="center">
        {left}
        {right}
      </Box>
    </Box>
  );
};
