import { Box } from 'grommet';
import { FC } from 'react';
import { ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { CampaignsExplorer } from './CampaignsExplorer';
import { WelcomeMessage } from './WelcomeMessage';

export interface ILandingPageProps {
  dum?: any;
}

export const LandingPage: FC<ILandingPageProps> = (props: ILandingPageProps) => {
  return (
    <>
      <Box>
        <ViewportContainer>
          <WelcomeMessage />
        </ViewportContainer>
        <ViewportContainer style={{ backgroundColor: '#f0f0f0' }}>
          <CampaignsExplorer />
        </ViewportContainer>
      </Box>
    </>
  );
};
