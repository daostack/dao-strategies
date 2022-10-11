import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { AppCard, AppHeading, AppLabel } from '../styles/BasicElements';
import { styleConstants } from '../styles/themes';
import { NewsletterSubscribe } from './NewsLetterSubscribe';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IHero extends BoxExtendedProps {}

export const Hero: FC<IHero> = (props: IHero) => {
  return (
    <TwoColumns>
      <Box
        style={{
          color: constants.lightGray,
          ...props.style,
        }}
        align="start"
        justify="start">
        <AppHeading
          level={1}
          style={{
            fontSize: '80px',
            lineHeight: '115px',
            textAlign: 'start',
            fontFamily: styleConstants.font.secondary,
            fontWeight: '700',
          }}>
          Rewards for Value Creators
        </AppHeading>
        <AppLabel style={{ maxWidth: '520px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Semper felis blandit donec pharetra. Id blandit
          tellus eu augue rhoncus. dipiscing elit. Semper felis
        </AppLabel>
      </Box>
      <AppCard
        style={{
          margin: '5vw 2vw',
          height: '300px',
          width: '80%',
          boxShadow: '0px 40.64px 54.56px rgba(14, 15, 25, 0.1)',
          borderRadius: '20px',
        }}
        justify="center"
        align="center">
        <NewsletterSubscribe />
      </AppCard>
    </TwoColumns>
  );
};
