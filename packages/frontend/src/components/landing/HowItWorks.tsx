import { Box, BoxExtendedProps, Grid, ResponsiveContext, Image } from 'grommet';
import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { constants } from './constants';

import { IElement, AppHeading, AppLabel } from '../styles/BasicElements';
import { HowItWorksLayoutBox } from './HowItWorksLayoutBox';

interface IBoxProps extends BoxExtendedProps {
  number: string;
  title: string;
  description: JSX.Element;
  iconPath: string;
}


export const HowItWorks: FC<IElement> = () => {
  const size = React.useContext(ResponsiveContext);

  const sections = () => [
    <>
      {/* First How To Section --> Create: */}
      <HowItWorksLayoutBox
        key={'how-it-works-1'}
        imagePath="/images/welcome-bg-1.png"
        description={
          <>
            <AppHeading size='40px' color='#D87D13'>Create</AppHeading>
            <Box
              margin={{ top: '20px' }}
              fill
              style={{ fontSize: '20px', lineHeight: '178%', letterSpacing: '-0.43px', color: '#989BA0', }}>
              When a campaign is executed, it’s contributors recieve shares according to the rule-set
            </Box>
          </>
        }></HowItWorksLayoutBox>

      {/* First Seperator SVG */}
      {!size.includes('small') && (<Box><img src="/images-landing/SeperatorFirst.svg" alt="first-seperator"></img></Box>)}
    </>,
    <>
      {/* Second How To Section --> Execute: */}
      <HowItWorksLayoutBox
        key={'how-it-works-2'}
        imagePath="/images/welcome-bg-1.png"
        imagePosition={size.includes('small') ? 'left' : 'right'}
        description={
          <>
            <AppHeading size='40px' color='#5762D5'>Execute</AppHeading>
            <Box
              margin={{ top: '20px' }}
              fill
              style={{ fontSize: '20px', lineHeight: '178%', letterSpacing: '-0.43px', color: '#989BA0' }}>
              When a campaign is executed, it’s contributors recieve shares according to the rule-set
            </Box>
          </>
        }></HowItWorksLayoutBox>

      {/* Second Seperator SVG*/}
      {!size.includes('small') && (<Box><img src="/images-landing/SeperatorSecond.svg" alt="first-seperator"></img></Box>)}
    </>,
    // Third How To Section --> Claim:
    <HowItWorksLayoutBox
      key={'how-it-works-3'}
      imagePath="/images/welcome-bg-1.png"
      description={
        <>
          <AppHeading size='40px' color='#4BA664'>Claim</AppHeading>
          <Box
            margin={{ top: '20px' }}
            fill
            style={{ fontSize: '20px', lineHeight: '178%', letterSpacing: '-0.43px', color: '#989BA0' }}>
            Contributors can then claim their rewards as a portion of all the assets, ERC-20 or native, that were sent (or will be sent) to the campaign
          </Box>
        </>
      }></HowItWorksLayoutBox>
  ];


  return (
    <Box
      fill
      style={{
        paddingTop: '3vw',
        paddingBottom: constants.paddingTop,
        backgroundColor: constants.lightBackground,
        marginTop: '5vh',
      }}
      align="center">
      <>
        <Box alignSelf="center" style={{ marginBottom: '36px', padding: '0px 6vw' }}>
          <AppHeading size="64px">How it works</AppHeading>
        </Box>
        {sections()}
      </>
    </Box>
  );
};
