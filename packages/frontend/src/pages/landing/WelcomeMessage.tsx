import { Box, Heading, Paragraph } from 'grommet';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AppButton } from '../../components/styles/BasicElements';

export interface IWelcomeMessage {
  className?: string;
  dum?: any;
}

const WelcomeMessageCore: FC<IWelcomeMessage> = (props: IWelcomeMessage) => {
  return (
    <>
      <Heading size="xlarge">
        Where value is <br></br>been Rewarded
      </Heading>
      <Paragraph size="xlarge">
        The Decentralized Funding & Distribution Platform. Built for anyone and for everyone. <br></br>Create
        interesting strategies to reward value.
      </Paragraph>

      <Box direction="row" style={{ marginTop: '32px' }}>
        <Link to="./create" style={{ marginRight: '52px' }}>
          <AppButton primary>Create a campaign</AppButton>
        </Link>

        <AppButton>Explore campaigns</AppButton>
      </Box>
    </>
  );
};

export const WelcomeMessage = styled(WelcomeMessageCore)``;
