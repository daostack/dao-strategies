import { Box, BoxExtendedProps, Grid, ResponsiveContext, Image } from 'grommet';
import React, { ReactNode } from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { constants } from './constants';

import { IElement, AppHeading, AppLabel } from '../styles/BasicElements';
import { HowItWorksLayoutBox } from './HowItWorksLayoutBox';
import { RoundedSVG } from './RoundedSVG';

interface DescriptionProps extends BoxExtendedProps {
  title: string;
  description: ReactNode;
  _color: string;
}

const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
  return (
    <Box style={{ padding: '0vw 2vw' }}>
      <AppHeading size="40px" color={props._color}>
        {props.title}
      </AppHeading>
      <Box fill style={{ fontSize: '20px', lineHeight: '178%', letterSpacing: '-0.43px', color: '#989BA0' }}>
        {props.description}
      </Box>
    </Box>
  );
};

export const HowItWorks: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const sections = () => [
    <>
      {/* First How To Section --> Create: */}
      <HowItWorksLayoutBox
        key={'how-it-works-1'}
        imagePath="/images/welcome-bg-1.png"
        description={
          <Description
            title="Create"
            description="When a campaign is executed, it’s contributors recieve shares according to the rule-set"
            _color="#D87D13"
          />
        }
        separatorUrl="/images-landing/SeperatorFirst.svg"></HowItWorksLayoutBox>
    </>,
    <>
      {/* Second How To Section --> Execute: */}
      <HowItWorksLayoutBox
        key={'how-it-works-2'}
        imagePath="/images/welcome-bg-1.png"
        flip
        description={
          <Description
            title="Execute"
            description="When a campaign is executed, it’s contributors recieve shares according to the rule-set"
            _color="#5762D5"
          />
        }
        separatorUrl="/images-landing/SeperatorSecond.svg"></HowItWorksLayoutBox>
    </>,
    // Third How To Section --> Claim:
    <HowItWorksLayoutBox
      key={'how-it-works-3'}
      imagePath="/images/welcome-bg-1.png"
      description={
        <Description
          title="Claim"
          description="Contributors can then claim their rewards as a portion of all the assets, ERC-20 or native, that were sent
            (or will be sent) to the campaign"
          _color="#4BA664"
        />
      }></HowItWorksLayoutBox>,
  ];

  return (
    <>
      <Box
        style={{
          backgroundColor: constants.lightBackground,
          position: 'relative',
          zIndex: 10,
          marginTop: '42vw',
          ...props.style,
        }}
        align="center">
        <>
          <Box alignSelf="center" style={{ marginBottom: '36px' }}>
            <RoundedSVG
              color={constants.lightBackground}
              style={{
                width: '100vw',
                zIndex: -1,
                position: 'absolute',
                top: 'calc(-5vw * 1.6 + -25px)',
                left: 0,
              }}
            />
            <AppHeading size="64px">How it works</AppHeading>
          </Box>
          {sections()}
        </>
      </Box>
    </>
  );
};
