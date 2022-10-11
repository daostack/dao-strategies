import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { icons } from './Apart.icons';
import { AppButton, AppHeading, AppLabel, IElement } from '../styles/BasicElements';
import styled from 'styled-components';
import { constants } from './constants';

interface IBoxProps extends BoxExtendedProps {
  icon: JSX.Element;
  title: string;
  subtitle: JSX.Element;
}

const FeatureCore: FC<IBoxProps> = (props: IBoxProps) => {
  const left = props.style !== undefined && props.style.textAlign === 'left';
  console.log('FeatureCore left ', left);
  return (
    <Box
      className={props.className}
      style={{
        textAlign: left ? 'left' : 'center',
        padding: '12px 16px 24px 16px',
        ...props.style,
      }}>
      <Box align={left ? 'start' : 'center'}>
        <Box style={{ height: '64px', marginBottom: '16px' }} justify={left ? 'start' : 'center'}>
          <>{props.icon}</>
        </Box>
        <Box style={{ marginBottom: '16px' }} justify={left ? 'start' : 'center'}>
          <AppLabel style={{ textTransform: 'inherit', fontWeight: 700, fontSize: '24px', color: constants.blackText }}>
            {props.title}
          </AppLabel>
        </Box>
        <AppLabel
          color={constants.lightGray}
          style={{ lineHeight: '22px', fontSize: '16px', textTransform: 'inherit' }}>
          <>{props.subtitle}</>
        </AppLabel>
      </Box>
    </Box>
  );
};

const Feature = styled(FeatureCore)`
  p {
    margin: 5px 0px;
  }
`;

export const SetUsApart: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const size = React.useContext(ResponsiveContext);

  const boxStyle = ((size: string): React.CSSProperties => {
    switch (size) {
      case 'xsmall':
      case 'small':
        return {
          width: '100%',
          textAlign: 'left',
        };
      case 'medium':
      case 'large':
        return {
          width: '50%',
          textAlign: 'left',
        };
      default:
        return {
          width: '25%',
          textAlign: 'left',
        };
    }
  })(size);
  return (
    <Box
      style={{
        borderRadius: '20px',
        paddingTop: '6vh',
        paddingLeft: constants.paddingLeft,
        paddingRight: constants.paddingLeft,
        backgroundColor: constants.lightBackground,

        ...props.style,
      }}>
      <Box alignSelf="start" style={{ marginBottom: '48px' }} gap="12px">
        <AppHeading size="64px">What sets us Apart</AppHeading>
        <AppButton
          color={constants.lightBackground}
          style={{
            fontWeight: 700,
            backgroundColor: constants.darkText,
            maxWidth: '364px',
          }}>
          Learn why Common Value
        </AppButton>
      </Box>
      <Box direction="row" align="start" wrap={true}>
        <Feature
          icon={icons.ruleBased}
          style={boxStyle}
          title="Rule-based rewards"
          subtitle={
            <>
              <p>A new primitive for DAO rewards distribution.</p>
              <p>Automatically distribute rewards to your community based on predefined rules.</p>
            </>
          }></Feature>
        <Feature
          icon={icons.easy}
          style={boxStyle}
          title="Easy to use"
          subtitle={
            <p>Create and deploy new reward campaigns, raise funds and distribute them with just a few clicks.</p>
          }></Feature>
        <Feature
          icon={icons.integrations}
          style={boxStyle}
          title="Multiple Integrations"
          subtitle={
            <>
              <p>Distribute rewards based on activity on different platforms (on and off-chain).</p>
              <p>Connect to Ethereum Protocols, Github, Twitter, Discord and others.</p>
            </>
          }></Feature>
        <Feature
          icon={icons.extensible}
          style={boxStyle}
          title="Extensible"
          subtitle={
            <p>
              Create custom sets of rules that easily and flexibly combine data from different sources and best fit your
              community needs.
            </p>
          }></Feature>
      </Box>
    </Box>
  );
};