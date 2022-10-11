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

interface IEmbeddedLanding {}

export const MAX_WIDTH_LANDING = 1600;

export const EmbeddedLanding: FC<IEmbeddedLanding> = (props: IEmbeddedLanding) => {
  return (
    <Box>
      <Box
        style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, margin: '0 auto', marginTop: HEADER_HEIGHT, padding: '0px 5vw' }}>
        <Banner></Banner>
        <Hero style={{ marginTop: '80px' }}></Hero>
        <LandingCampaigns style={{ marginTop: '60px' }}></LandingCampaigns>
      </Box>

      <Box style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, margin: '0 auto', padding: '0px 5vw' }}>
        <SetUsApart style={{ marginTop: '8vw' }}></SetUsApart>
      </Box>

      <HowItWorks style={{ marginTop: '8vw' }}></HowItWorks>
      <ComingNext></ComingNext>
      <Footer></Footer>
    </Box>
  );
};
