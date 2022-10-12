import { Box, BoxExtendedProps, Grid, ResponsiveContext, Image } from 'grommet';
import React, { ReactNode } from 'react';
import { FC } from 'react';

import { AppHeading, AppLabel } from '../styles/BasicElements';
import { HowItWorksLayoutBox } from './HowItWorksLayoutBox';
import { RoundedSVG } from './RoundedSVG';
import { styleConstants } from '../styles/themes';
import { relative } from 'path';

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
      <Box style={{ height: '16px' }}></Box>
      <Box fill style={{ fontSize: '20px', lineHeight: '178%', letterSpacing: '-0.43px', color: '#989BA0' }}>
        {props.description}
      </Box>
    </Box>
  );
};

export const HowItWorks: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const size = React.useContext(ResponsiveContext);

  const additionalImage = (): JSX.Element => {
    const twinkleStarsAroundImage = (): JSX.Element[] => {
      const stars = [] as JSX.Element[];
      const starPositions = [
        {
          top: '25px',
          right: '100px',
        },
        {
          bottom: '25px',
          left: '130px',
        },
        {
          top: '125px',
          left: '140px',
        },
        {
          bottom: '140px',
          left: '80px',
        },
      ];

      for (let index = 0; index < 5; index++) {
        stars.push(
          <Image
            width="16px"
            height="16px"
            style={{ position: 'absolute', ...starPositions[index] }}
            src="/images-landing/star.svg"></Image>
        );
      }
      return stars;
    };

    return (
      <Box>
        <Image fit="cover" src="images-landing/HowItWorksImage.png" />
        {twinkleStarsAroundImage()}
      </Box>
    );
  };

  const sections = () => [
    <>
      {/* First How To Section --> Create: */}
      <HowItWorksLayoutBox
        key={'how-it-works-1'}
        style={{ marginBottom: '24px' }}
        imagePath="/images-landing/example-01-v2.png"
        description={
          <Description
            title="Create"
            description="Choose the reward rules for the campaign & deploy it to one of many supported chains"
            _color="#D87D13"
          />
        }
        separatorUrl="/images-landing/SeperatorFirst.svg"></HowItWorksLayoutBox>
    </>,
    <>
      {/* Second How To Section --> Execute: */}
      <HowItWorksLayoutBox
        key={'how-it-works-2'}
        imagePath="/images-landing/example-02-v2.png"
        flip
        description={
          <Description
            title="Execute"
            description="Campaign shares are distributed to the contributors, according to the predefined rules"
            _color="#5762D5"
          />
        }
        separatorUrl="/images-landing/SeperatorSecond.svg"
        additionalImage={additionalImage()}></HowItWorksLayoutBox>
    </>,
    // Third How To Section --> Claim with additional picture
    <>
      <HowItWorksLayoutBox
        key={'how-it-works-3'}
        imagePath="/images-landing/example-03-v2.png"
        description={
          <Description
            title="Claim"
            description="Contributors can then claim their rewards as a portion of all the assets, ERC-20 or native, that were sent
         (or will be sent) to the campaign"
            _color="#4BA664"
          />
        }></HowItWorksLayoutBox>
    </>,
  ];

  return (
    <>
      <Box
        style={{
          ...props.style,
        }}
        align="center">
        <>
          <Box alignSelf="center" style={{ marginBottom: '36px', padding: '6vw 0' }}>
            <AppLabel style={{ textAlign: 'center' }}>Creating a campaign</AppLabel>
            <AppHeading size="64px" style={{ marginTop: '20px', fontFamily: styleConstants.font.secondary }}>
              How it works
            </AppHeading>
          </Box>
          {sections()}
        </>
      </Box>
    </>
  );
};
