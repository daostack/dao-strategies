import { FC } from 'react';
import styled from 'styled-components';
import { AppButton } from '../../components/styles/BasicElements';
import { VerticalFlex, HorizontalFlex } from '../../components/styles/LayoutComponents.styled';
import { styleConstants } from '../../components/styles/themes';

export interface IWelcomeMessage {
  className?: string;
  dum?: any;
}

const WelcomeMessageCore: FC<IWelcomeMessage> = (props: IWelcomeMessage) => {
  return (
    <VerticalFlex className={props.className}>
      <h1>
        Where value is <br></br>been Rewarded
      </h1>
      <p className="slogan">
        The Decentralized Funding & Distribution Platform. Built for anyone and for everyone. <br></br>Create
        interesting strategies to reward value.
      </p>
      <HorizontalFlex>
        <AppButton type="primary" style={{ marginRight: '52px' }}>
          Create a campaign
        </AppButton>
        <AppButton>Explore campaigns</AppButton>
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
    margin: 0;
  }

  .slogan {
    margin: 40px 0px 64px 0px;
    font-size: ${styleConstants.fontSize};
    font-weight: 700;
    color: ${(props) => props.theme.colors.secondary_color};
  }
`;
