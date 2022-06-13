import { FC } from 'react';
import { VerticalFlex, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { CampaignsExplorer } from './CampaignsExplorer';
import { WelcomeMessage } from './WelcomeMessage';

export interface ILandingPageProps {
  dum?: any;
}

export const LandingPage: FC<ILandingPageProps> = (props: ILandingPageProps) => {
  return (
    <>
      <VerticalFlex>
        <ViewportContainer>
          <WelcomeMessage />
        </ViewportContainer>
        <ViewportContainer style={{ backgroundColor: '#f0f0f0' }}>
          <CampaignsExplorer />
        </ViewportContainer>
      </VerticalFlex>
    </>
  );
};
