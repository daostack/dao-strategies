import { FC } from 'react';
import { SetUsApart } from './Apart';
import { ComingNext } from './ComingNext';
import { motion } from 'framer-motion';
import { HowItWorks } from './HowItWorks';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Banner } from './Banner';
import { Box } from 'grommet';
import { MAX_WIDTH } from '../../pages/AppHeader';

interface IEmbeddedLanding {}

export const EmbeddedLanding: FC<IEmbeddedLanding> = (props: IEmbeddedLanding) => {
  return (
    <motion.div initial={{ opacity: 0 }} transition={{ duration: 0.5 }} animate={{ opacity: 1 }}>
      <Box style={{ maxWidth: `${MAX_WIDTH}px`, margin: '0 auto', padding: '0px 5vw' }}>
        <Banner></Banner>
        <Hero style={{ marginTop: '80px' }}></Hero>
        <SetUsApart></SetUsApart>
        <HowItWorks></HowItWorks>
        <ComingNext></ComingNext>
        <Footer></Footer>
      </Box>
    </motion.div>
  );
};
