import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import { CSSProperties, FC, useContext } from 'react';
import { AppCard, AppHeading, AppLabel } from '../styles/BasicElements';
import { styleConstants } from '../styles/themes';
import { NewsletterSubscribe } from './NewsLetterSubscribe';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IHero extends BoxExtendedProps {}

export const Hero: FC<IHero> = (props: IHero) => {
  const size = useContext(ResponsiveContext);

  const headingStyle = ((): CSSProperties => {
    switch (size) {
      case 'xsmall':
      case 'small':
        return {
          fontSize: '70px',
          lineHeight: '110%',
        };

      case 'medium':
        return {
          fontSize: '80px',
          lineHeight: '110%',
        };

      case 'large':
        return {
          fontSize: '90px',
          lineHeight: '110%',
        };

      default:
        return {
          fontSize: '90px',
          lineHeight: '110%',
        };
    }
  })();

  const textHeadlineAttributes = Object.assign(
    { textAlign: 'start', fontFamily: styleConstants.font.secondary, fontWeight: '700' },
    headingStyle
  );

  return (
    <TwoColumns style={{ ...props.style }}>
      <Box
        style={{
          color: constants.lightGray,
        }}
        align="start"
        justify="start">
        <AppHeading level={1} style={textHeadlineAttributes}>
          Rewards for{' '}
          <span
            style={{
              ...textHeadlineAttributes,
              marginRight: '10px',
              background: `url(//s2.svgbox.net/pen-brushes.svg?ic=brush-1&color=${constants.lightGreen.replace(
                '#',
                ''
              )})`,
            }}>
            Value
          </span>
          Creators
        </AppHeading>

        <AppLabel
          color={constants.subParagraphGray}
          style={{
            maxWidth: '520px',
            marginTop: '2vw',
            fontFamily: 'DM Sans',
            fontWeight: 400,
            lineHeight: '156.4%',
            letterSpacing: '-0.43px',
            fontSize: '20px',
            textTransform: 'inherit',
          }}>
          Web3 incentive engine for communities. CommonValue is a rewards platform that connects web2 activities to web3
          rewards
        </AppLabel>
      </Box>
      <AppCard
        style={{
          margin: '5vw 2vw',
          height: '300px',
          width: size.includes('small') ? '100%' : '80%',
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
