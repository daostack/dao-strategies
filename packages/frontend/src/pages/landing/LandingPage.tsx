import { Button } from 'antd';
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
        <ViewportContainer>
          <CampaignsExplorer />
        </ViewportContainer>
      </VerticalFlex>
    </>
  );
};
