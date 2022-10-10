import { Box } from 'grommet';
import { FormDown } from 'grommet-icons';
import { FC, useEffect, useState } from 'react';
import { EmbeddedLanding } from '../../components/landing/EmbeddedLanding';
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
        {/* <ViewportContainer>
          {<WelcomeMessage /> }
        </ViewportContainer> */}
        <EmbeddedLanding />

      </Box>
    </>
  );
};
