import { FC } from 'react';
import { SetUsApart } from './Apart';
import { ComingNext } from './ComingNext';

import { HowItWorks } from './HowItWorks';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Banner } from './Banner';
import { Box } from 'grommet';
import { HEADER_HEIGHT } from '../../pages/AppHeader';
import { LandingCampaigns } from './LandingCampaigns';
import { constants } from './constants';

interface IEmbeddedLanding {}

export const MAX_WIDTH_LANDING = 1600;

export const EmbeddedLanding: FC<IEmbeddedLanding> = (props: IEmbeddedLanding) => {
  return (
    <Box style={{}} align="center">
      <Box style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, margin: `${HEADER_HEIGHT}px 0 0 `, padding: '0px 5vw' }}>
        <Banner bannerLink="https://t.me/+a0mIY6gHOG00OGU0" style={{ marginTop: '32px' }}></Banner>
        <Box style={{ height: '10vw', maxHeight: '150px' }}></Box>
        <Hero style={{}}></Hero>
        <Box style={{ height: '15vw', maxHeight: '200px' }}></Box>
        <LandingCampaigns style={{}}></LandingCampaigns>
      </Box>

      <Box style={{ height: '15vw', maxHeight: '250px' }}></Box>
      <Box style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, margin: '0 auto 0 auto', padding: '0px 5vw' }}>
        <SetUsApart style={{}}></SetUsApart>
      </Box>

      <Box style={{ height: '15vw', maxHeight: '300px' }}></Box>
      <Box style={{ backgroundColor: constants.lightBackground }} align="center">
        <HowItWorks style={{}}></HowItWorks>
        <Box style={{ height: '10vw', maxHeight: '300px' }}></Box>
        <ComingNext style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, padding: '0 5vw' }}></ComingNext>
        <Box style={{ height: '10vw', maxHeight: '300px' }}></Box>
      </Box>
      <Footer style={{}}></Footer>
    </Box>
  );
};
