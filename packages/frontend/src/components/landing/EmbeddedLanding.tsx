import { FC } from 'react';
import { SetUsApart } from './Apart';
import { ComingNext } from './ComingNext';

import { HowItWorks } from './HowItWorks';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Banner } from './Banner';
import { Box } from 'grommet';
import { HEADER_HEIGHT, MAX_WIDTH } from '../../pages/AppHeader';

interface IEmbeddedLanding {}

export const EmbeddedLanding: FC<IEmbeddedLanding> = (props: IEmbeddedLanding) => {
  return (
    <Box>
      <Box style={{ maxWidth: `${1600}px`, margin: '0 auto', marginTop: HEADER_HEIGHT, padding: '0px 5vw' }}>
        <Banner></Banner>
        <Hero style={{ marginTop: '80px' }}></Hero>
        <SetUsApart style={{ marginTop: '8vw' }}></SetUsApart>
      </Box>
      <HowItWorks style={{ marginTop: '8vw' }}></HowItWorks>
      <ComingNext></ComingNext>
      <Footer></Footer>
    </Box>
  );
};
