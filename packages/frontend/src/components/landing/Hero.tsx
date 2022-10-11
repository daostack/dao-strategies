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

interface IHero extends BoxExtendedProps {}

export const Hero: FC<IHero> = (props: IHero) => {
  const size = React.useContext(ResponsiveContext);

  const config = ((size: string): any => {
    switch (size) {
      case 'xsmall':
      case 'small':
        return {
          direction: 'column',
          widths: ['100%', '100%'],
          justifyText: 'center',
          alignText: 'center',
        };
      case 'medium':
      case 'large':
        return {
          direction: 'row',
          widths: ['50%', '50%'],
          justifyText: 'center',
          alignText: 'center',
        };
      default:
        return {};
    }
  })(size);
  console.log(config);
  return (
    <Box
      fill
      style={{
        paddingLeft: '10vw',
        paddingRight: '10vw',
        marginTop: '6vw',
        marginBottom: '20vw',
      }}
      direction={config.direction}>
      {/* Hero Message and subparagraph */}
      <Box
        flex={{ grow: 0, shrink: 0 }}
        style={{
          width: config.widths[0],
          color: constants.lightGray,
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

      {/* CTA --> SignUp Form */}
      <Box width={config.widths[1]}>
        <NewsletterSubscribe />
      </Box>
    </Box>
  );
};
