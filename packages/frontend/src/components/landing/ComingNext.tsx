import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { constants } from './constants';

import { AppHeading, AppLabel, IElement } from '../styles/BasicElements';

interface IBoxProps extends BoxExtendedProps {
  iconPath: string;
  name: string;
}

const Platform: FC<IBoxProps> = (props: IBoxProps) => {
  return (
    <Box style={{ ...props.style, padding: '16px 16px' }}>
      <Box
        direction="row"
        align="center"
        justify="center"
        style={{
          textAlign: 'center',
          backgroundColor: constants.lightGray,
          padding: '30px',
          borderRadius: '8px',
        }}>
        <Box>
          <img style={{ height: '32px', width: '32px' }} src={props.iconPath} alt="logo"></img>
        </Box>
        <AppLabel style={{ marginLeft: '8px' }}>{props.name}</AppLabel>
      </Box>
    </Box>
  );
};

export const ComingNext: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const size = React.useContext(ResponsiveContext);

  const boxStyle = ((size: string): React.CSSProperties => {
    switch (size) {
      case 'xsmall':
        return {
          width: '100%',
        };
      case 'small':
        return {
          width: '50%',
        };
      case 'medium':
        return {
          width: '50%',
        };
      case 'large':
        return {
          width: '25%',
        };
      default:
        return {
          width: '25%',
        };
    }
  })(size);

  return (
    <Box
      style={{
        padding: '6vw',
        margin: '0 auto',
        width: '100%',
        backgroundColor: constants.lightBackground,
        ...props.style,
      }}
      align="center">
      <Box alignSelf="start" style={{ marginBottom: '36px' }}>
        <AppHeading size="28px">
          -Coming Soon- <span style={{ color: constants.lightGray }}>New Integrations</span>
        </AppHeading>
      </Box>
      <Box
        direction="row"
        align="start"
        style={{
          width: '100%',
        }}
        wrap={true}>
        <Platform iconPath="/images-landing/Twitter.svg" style={boxStyle} name="Twitter"></Platform>
        <Platform iconPath="/images-landing/eth.svg" style={boxStyle} name="Ethereum"></Platform>
        <Platform iconPath="/images-landing/Notion.svg" style={boxStyle} name="Notion"></Platform>
        <Platform iconPath="/images-landing/Discord.svg" style={boxStyle} name="Discord"></Platform>
      </Box>
    </Box>
  );
};
