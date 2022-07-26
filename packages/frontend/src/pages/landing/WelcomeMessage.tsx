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
      <Heading style={{ textAlign: 'center' }} size="xlarge">
        Great work should<br></br>be rewarded
      </Heading>
      <Paragraph style={{ textAlign: 'center' }} size="xlarge">
        Create a campaign, raise funds, and get them automatically distributed to your Github contributors.
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
