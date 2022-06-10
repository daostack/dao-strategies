import { FC } from 'react';
import styled from 'styled-components';
import { AppButton } from '../../components/styles/BasicElements';
import { VerticalFlex, HorizontalFlex } from '../../components/styles/LayoutComponents.styled';

export interface IWelcomeMessage extends React.PropsWithChildren {
  className?: string;
  dum?: any;
}

const WelcomeMessageCore: FC<IWelcomeMessage> = (props: IWelcomeMessage) => {
  return (
    <VerticalFlex className={props.className}>
      <h1>
        Where value is <br></br>been Rewarded
      </h1>
      <HorizontalFlex>
        <AppButton type="primary" style={{ marginRight: '1.5rem' }}>
          Create Campaign
        </AppButton>
        <AppButton>Explore Campaigns</AppButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};

export const WelcomeMessage = styled(WelcomeMessageCore)`
  h1 {
    font-style: normal;
    font-size: 96px;
    font-weight: 700;
    line-height: 120px;
    text-align: center;
  }
`;
