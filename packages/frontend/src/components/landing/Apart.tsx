import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { icons } from './Apart.icons';
import { AppButton, AppHeading, AppLabel, IElement } from '../styles/BasicElements';
import styled from 'styled-components';
import { constants } from './constants';
import { styleConstants } from '../styles/themes';
import { ResponsiveStyleConfig, ResponsiveStyleValue, useMainContext } from '../../pages/MainPage';

interface IBoxProps extends BoxExtendedProps {
  icon: JSX.Element;
  title: string;
  subtitle: JSX.Element;
}

const FeatureCore: FC<IBoxProps> = (props: IBoxProps) => {
  const left = props.style !== undefined && props.style.textAlign === 'left';

  return (
    <Box
      className={props.className}
      style={{
        textAlign: left ? 'left' : 'center',
        padding: '12px 16px 24px 16px',
        ...props.style,
      }}
      align="center">
      <Box align={left ? 'start' : 'center'} style={{ maxWidth: '350px' }}>
        <Box style={{ height: '64px', marginBottom: '16px' }} justify={left ? 'start' : 'center'}>
          <>{props.icon}</>
        </Box>
        <Box
          style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 500, color: constants.blackText }}
          justify={left ? 'start' : 'center'}>
          {props.title}
        </Box>
        <Box style={{ lineHeight: '22px', fontSize: '16px', color: styleConstants.colors.lightGrayTextDarker }}>
          <>{props.subtitle}</>
        </Box>
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
  const { responsiveStyle } = useMainContext();

  const boxStyle = responsiveStyle([
    [['xsmall', 'small'], { width: '100%', textAlign: 'left' }],
    [['medium', 'large'], { width: '50%', textAlign: 'left' }],
  ]);

  return (
    <Box
      style={{
        borderRadius: '20px',
        padding: '6vh 4vw 0 4vw',
        backgroundColor: constants.lightBackground,
        ...props.style,
      }}>
      <Box direction="row" align="start" wrap={true}>
        <Feature
          icon={icons.ruleBased}
          style={boxStyle}
          title="Customizable Reward Rules"
          subtitle={
            <>
              <p>Create your own rules for how Github interactions will result in rewards and recognition</p>
            </>
          }></Feature>
        <Feature
          icon={icons.easy}
          style={boxStyle}
          title="Stay On Github"
          subtitle={
            <p>Empower your community with new Web3 capabilities in an environment they already know.</p>
          }></Feature>
        <Feature
          icon={icons.integrations}
          style={boxStyle}
          title="Encourage Collaboration"
          subtitle={
            <>
              <p>Recognize and reward contributors as they work on big and small tasks</p>
            </>
          }></Feature>
        <Feature
          icon={icons.extensible}
          style={boxStyle}
          title="Easy Flow To Web3"
          subtitle={<p>Contributors' rewards await them in a smart contract until they connect with their Github identity, no need for complicated onboarding</p>}></Feature>
      </Box>
      <Box alignSelf="center" style={{ marginBottom: '48px' }} gap="12px">
        <a
          href='https://mirror.xyz/commonvalue.eth/ylPTlZpyAHurMSjIoKJmjLFKmuxkmB652UrWpS6dEkk'
          target="_blank"
          rel="noreferrer">
          <AppButton
            color={constants.lightBackground}
            as='a'
            style={{
              fontWeight: 700,
              backgroundColor: constants.darkText,
              maxWidth: '364px',
            }}>
            Learn more
          </AppButton>
        </a>
      </Box>
    </Box>
  );
};
