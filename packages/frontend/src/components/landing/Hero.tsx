import { Box, BoxExtendedProps, Heading, Paragraph, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC, ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HEADER_HEIGHT, MAX_WIDTH } from '../../pages/AppHeader';
import { AppButton, AppCard, AppHeading, AppLabel } from '../styles/BasicElements';
import { styleConstants } from '../styles/themes';
import { NewsletterSubscribe } from './NewsLetterSubscribe';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IHero extends BoxExtendedProps {}

export const Hero: FC<IHero> = (props: IHero) => {
  return (
    <TwoColumns>
      <Box
        style={{
          color: constants.lightGray,
          ...props.style,
        }}
        align="start"
        justify="start">
        <AppHeading
          level={1}
          style={{
            fontSize: '80px',
            lineHeight: '115px',
            textAlign: 'start',
            fontFamily: styleConstants.font.secondary,
            fontWeight: '700',
          }}>
          Rewards for Value <br />
          Creators
        </AppHeading>
        <AppLabel style={{ maxWidth: '520px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Semper felis blandit donec pharetra. Id blandit
          tellus eu augue rhoncus. dipiscing elit. Semper felis
        </AppLabel>
      </Box>
      <Box style={{ padding: '5vw 5vw', height: '300px' }} justify="center" align="center">
        <NewsletterSubscribe />
      </Box>
    </TwoColumns>
  );
};
