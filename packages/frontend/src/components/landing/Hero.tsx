import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import { CSSProperties, FC, useContext } from 'react';
import { AppCard, AppHeading, AppLabel } from '../styles/BasicElements';
import { styleConstants } from '../styles/themes';
import { NewsletterSubscribe } from './NewsLetterSubscribe';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';
import { useMainContext } from '../../pages/MainPage';

interface IHero extends BoxExtendedProps {}

export const Hero: FC<IHero> = (props: IHero) => {
  const { mobile, responsiveStyle, scaleText } = useMainContext();
  const size = useContext(ResponsiveContext);

  const headingStyle = responsiveStyle([
    [['xsmall', 'small'], { fontSize: '70px', lineHeight: '110%' }],
    [['medium'], { fontSize: '80px', lineHeight: '110%' }],
    [['large'], { fontSize: '100px', lineHeight: '110%' }],
    [['default'], { fontSize: '90px', lineHeight: '110%' }],
  ]);
  const textSize = scaleText(constants.mediumSize);
  const textHeadlineAttributes = Object.assign(
    { textAlign: 'start', fontFamily: styleConstants.font.secondary, fontWeight: '700', wordBreak: 'break-word' },
    headingStyle
  );
  const leftLayoutDependingOnSize = () => {
    return (
      <Box
        style={{
          color: constants.lightGray,
        }}
        align="start"
        justify="start">
        <AppHeading level={1} style={textHeadlineAttributes}>
          Rewards for{' '}
          <span style={{ position: 'relative', zIndex: '1', overflow: 'visible' }}>
            Value
            <span
              style={{
                zIndex: '-1',
                height: '100%',
                width: mobile ? '15rem' : '135%',
                background: `url(/images/penbrush.png) center no-repeat`,
                backgroundSize: 'contain',
                position: 'absolute',
                left: '-1vw',
                top: mobile ? '0px' : '3%',
                overflow: 'visible',
              }}></span>{' '}
            <br />
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
    );
  };

  const rightLayoutDependingOnSize = (isLarge: boolean) => {
    return (
      <AppCard
        style={{
          margin: '5vw 2vw',
          height: '300px',
          width: mobile ? '100%' : '80%',
          boxShadow: '0px 40.64px 54.56px rgba(14, 15, 25, 0.1)',
          borderRadius: '20px',
          maxWidth: '450px',
          ...(isLarge && { position: 'absolute', transform: `translate(37vw, 20%)` }),
        }}
        justify="center"
        align="center">
        <NewsletterSubscribe />
      </AppCard>
    );
  };

  return (
    <>
      {size.includes('large') ? (
        <Box style={{ position: 'relative' }}>
          {leftLayoutDependingOnSize()}
          {rightLayoutDependingOnSize(true)}
        </Box>
      ) : (
        <>
          <TwoColumns mediumIsSmall style={{ ...props.style }}>
            {leftLayoutDependingOnSize()}
            {rightLayoutDependingOnSize(false)}
          </TwoColumns>
        </>
      )}
    </>
  );
};
