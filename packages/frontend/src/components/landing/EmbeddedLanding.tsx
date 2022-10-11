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
    <Box style={{ paddingTop: HEADER_HEIGHT }}>
      <Box style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, marginTop: HEADER_HEIGHT, padding: '0px 5vw' }}>
        <Banner></Banner>
        <Hero style={{ marginTop: '10vw' }}></Hero>
        <LandingCampaigns style={{ marginTop: '15vw' }}></LandingCampaigns>
      </Box>

      <Box style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, margin: '15vw auto 0 auto', padding: '0px 5vw' }}>
        <SetUsApart style={{ marginTop: '8vw' }}></SetUsApart>
      </Box>

      <Box style={{ backgroundColor: constants.lightBackground, marginTop: '14vw' }}>
        <HowItWorks style={{}}></HowItWorks>
        <ComingNext style={{ maxWidth: `${MAX_WIDTH_LANDING}px`, margin: '12vw auto' }}></ComingNext>
      </Box>
      <Footer style={{}}></Footer>
    </Box>
  );
};
