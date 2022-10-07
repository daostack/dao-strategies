import { Box, CheckBox } from 'grommet';
import { Add, Moon } from 'grommet-icons';
import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoggedUser } from '../components/LoggedUser';
import { Logo } from '../components/Logo';
import { AppButton } from '../components/styles/BasicElements';
import { styleConstants } from '../components/styles/themes';
import { useThemeContext } from '../ThemedApp';
import { RouteNames } from './MainPage';

export const HEADER_HEIGHT = 96;
export const MAX_WIDTH = 1200;

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const AppHeader: FC<IMainPageHeaderProps> = (props) => {
  const { setTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const left = <Logo onClick={() => navigate(RouteNames.Base)}></Logo>;

  const right = (
    <Box direction="row" align="center">
      {/* Currently not working, so we hide it for now
       <Box style={{ marginRight: '24px' }} direction="row" align="center">
        <CheckBox toggle onChange={(event) => setTheme(event.target.checked)}></CheckBox>
        <Moon style={{ marginLeft: '6px' }}></Moon>
      </Box> */}
      {location.pathname === RouteNames.Campaigns ? (
        <AppButton
          onClick={() => navigate(RouteNames.Create)}
          icon={<Add></Add>}
          className="hide-mobile" //hide create button on mobile
          style={{ marginRight: '16px' }}
          _type="slim"
          label="Create"
        />
      ) : (
        <></>
      )}
      <LoggedUser></LoggedUser>
    </Box>
  );

  return (
    <Box
      style={{
        position: 'absolute',
        width: '100vw',
        height: `${HEADER_HEIGHT}px`,

        backgroundColor: styleConstants.colors.whiteElements,
        boxShadow: '0px 1.63701px 24.5552px rgba(0, 0, 0, 0.08)',
      }}
      direction="row"
      justify="center">
      <Box
        style={{ width: '100%', padding: '0px 32px', maxWidth: `${MAX_WIDTH}px` }}
        direction="row"
        justify="between"
        align="center">
        {left}
        {right}
      </Box>
    </Box>
  );
};
