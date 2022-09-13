import { Box } from 'grommet';
import { FormDown } from 'grommet-icons';
import { FC, useEffect, useState } from 'react';
import { ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { CampaignsExplorer } from './CampaignsExplorer';
import { WelcomeMessage } from './WelcomeMessage';

export interface ILandingPageProps {
  dum?: any;
}

export const LandingPage: FC<ILandingPageProps> = (props: ILandingPageProps) => {
  const [showDown, setShowDown] = useState<boolean>(true);

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        setShowDown(false);
      } else {
        setShowDown(true);
      }
    });
  }, []);

  return (
    <>
      <Box>
        <ViewportContainer>
          <WelcomeMessage />
          {showDown ? (
            <Box
              onClick={() => scrollDown()}
              style={{ position: 'absolute', bottom: '0', height: '60px', textAlign: 'center', cursor: 'pointer' }}
              align="center">
              Scroll down<br></br>
              <FormDown></FormDown>
            </Box>
          ) : (
            <></>
          )}
        </ViewportContainer>

        <CampaignsExplorer style={{ maxWidth: '1600px', margin: '0 auto' }} />
      </Box>
    </>
  );
};
