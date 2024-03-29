import { Box } from 'grommet';
import { Add } from 'grommet-icons';
import React, { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoggedUser } from '../components/LoggedUser';
import { Logo } from '../components/Logo';
import { AppButton } from '../components/styles/BasicElements';
import { styleConstants } from '../components/styles/themes';
import { RouteNames, useMainContext } from './MainPage';

export const HEADER_HEIGHT = 80;
export const MAX_WIDTH = 1200;

export interface IMainPageHeaderProps {
  children?: React.ReactNode;
}

export const AppHeader: FC<IMainPageHeaderProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mobile } = useMainContext();

  const left = (
    <>
      <Box direction="row">
        <Logo compact={mobile} onClick={() => navigate(RouteNames.Base)}></Logo>

        <Box
          align="center"
          justify="center"
          pad={{ horizontal: '10px' }}
          margin={{ left: '16px', vertical: '12px' }}
          style={{ fontWeight: 500, minWidth: '31px', color: styleConstants.colors.whiteElements }}
          background="#5762D5">
          Beta
        </Box>

        {!mobile ? (
          <Box
            align="center"
            justify="center"
            direction="row"
            gap="20px"
            style={{ fontWeight: 500 }}
            margin={{ left: '48px' }}>
            <Link style={{ textDecoration: 'none', color: styleConstants.colors.text }} to={RouteNames.Campaigns}>
              Explore Campaigns
            </Link>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </>
  );

  const right = (
    <Box direction="row" align="center">
      {/* Currently not working, so we hide it for now
       <Box style={{ marginRight: '24px' }} direction="row" align="center">
        <CheckBox toggle onChange={(event) => setTheme(event.target.checked)}></CheckBox>
        <Moon style={{ marginLeft: '6px' }}></Moon>
      </Box> */}
      {location.pathname === RouteNames.Campaigns ? (
        <>
          {!mobile && (
            <AppButton
              onClick={() => navigate(RouteNames.Create)}
              icon={<Add></Add>}
              style={{ marginRight: '16px' }}
              _type="slim"
              label="Create"
            />
          )}
        </>
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
      }}
      direction="row"
      justify="center"
      align="center">
      <Box style={{ width: '100%', padding: '0px 32px', maxWidth: `${MAX_WIDTH}px` }} direction="row" justify="between">
        {left}
        {right}
      </Box>
    </Box>
  );
};
