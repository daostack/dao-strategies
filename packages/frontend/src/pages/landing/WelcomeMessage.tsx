import { Box, BoxExtendedProps, Heading, Paragraph } from 'grommet';
import { FC, ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppButton, AppCard, AppHeading } from '../../components/styles/BasicElements';
import { styleConstants } from '../../components/styles/themes';
import { HEADER_HEIGHT, MAX_WIDTH } from '../AppHeader';

export interface IWelcomeMessage {
  className?: string;
  dum?: any;
}

interface IForCard extends BoxExtendedProps {
  path: string;
  title: string;
  subtitle: string;
  backgroundUrl: string;
  action: ReactElement;
}

const ForCard: FC<IForCard> = (props: IForCard) => {
  const navigate = useNavigate();

  return (
    <AppCard
      fill
      justify="center"
      style={{
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        padding: '0',
      }}
      onClick={() => navigate(props.path)}>
      <Box fill style={{ zIndex: 2, padding: '60px 4vw', maxHeight: '380px' }} align="center" justify="center">
        <AppHeading
          level={2}
          style={{
            color: styleConstants.colors.whiteElements,
            fontFamily: styleConstants.font.secondary,
            fontWeight: '600',
            fontSize: '40px',
            textAlign: 'center',
          }}>
          {props.title}
        </AppHeading>
        <Box
          justify="center"
          style={{
            flexGrow: 1,
            color: styleConstants.colors.whiteElements,
            fontSize: '20px',
            fontWeight: '400',
            maxWidth: '350px',
            textAlign: 'center',
          }}>
          {props.subtitle}
        </Box>
        <Link style={{ alignSelf: 'stretch' }} to="./create">
          {props.action}
        </Link>
      </Box>
      <Box
        style={{
          zIndex: 1,
          height: '100%',
          width: '100%',
          position: 'absolute',
          background: `url(${props.backgroundUrl}) center no-repeat`,
          backgroundSize: 'cover',
        }}></Box>
    </AppCard>
  );
};

const WelcomeMessageCore: FC<IWelcomeMessage> = (props: IWelcomeMessage) => {
  return (
    <Box fill style={{ marginTop: HEADER_HEIGHT, padding: '37px 37px', maxWidth: `${MAX_WIDTH}px` }}>
      <AppCard style={{ flexGrow: 1, borderRadius: '24px' }} align="center" justify="center">
        <AppHeading
          level={1}
          style={{
            fontSize: '80px',
            lineHeight: '115px',
            textAlign: 'center',
            fontFamily: styleConstants.font.secondary,
            fontWeight: '700',
          }}>
          Rewards for <br />
          Value Creators
        </AppHeading>
      </AppCard>

      <Box gap="40px" style={{ flexGrow: 1, marginTop: '40px' }} direction="row">
        <ForCard
          title="For Contributors"
          subtitle="Find what excites you, contribute and get rewarded"
          path="/campaigns"
          action={
            <AppButton
              primary
              style={{ width: '100%', backgroundColor: 'white', color: styleConstants.colors.primary, border: 'none' }}
              label="Explore campaigns"
            />
          }
          backgroundUrl="/images/welcome-bg-1.png"></ForCard>
        <ForCard
          title="For Communities"
          subtitle="Incentivize, grow and reward your contributors"
          path="/create"
          action={<AppButton primary style={{ width: '100%' }} label="Create a campaign" />}
          backgroundUrl="/images/welcome-bg-2.png"></ForCard>
      </Box>
    </Box>
  );
};

export const WelcomeMessage = styled(WelcomeMessageCore)``;
