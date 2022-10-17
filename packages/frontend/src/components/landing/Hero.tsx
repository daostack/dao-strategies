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
    { textAlign: 'start', fontFamily: styleConstants.font.secondary, fontWeight: '700', wordBreak: 'break-word' },
    headingStyle
  );
  const leftLayoutDependingOnSize = (isLarge: boolean) => {
    return (
      <Box
        style={{
          color: constants.lightGray,
        }}
        align="start"
        justify="start">
        <AppHeading level={1} style={textHeadlineAttributes}>
          Rewards for{' '}
          <span style={{ position: 'relative', zIndex: '1' }}>
            Value
            <span
              style={{
                zIndex: '-1',
                height: headingStyle.fontSize,
                width: size.includes('small') ? '200px' : '17vw',
                background: `url(/images/penbrush.svg) center no-repeat`,
                backgroundSize: 'fit',
                position: 'absolute',
                left: '0px',
                top: '8px',
                overflow: 'visible',
              }}></span>{' '}
            {isLarge && <br />}
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
          width: size.includes('small') ? '100%' : '80%',
          boxShadow: '0px 40.64px 54.56px rgba(14, 15, 25, 0.1)',
          borderRadius: '20px',
          maxWidth: '350px',
          ...(isLarge && { position: 'absolute', right: 0, transform: 'translate(75%, 30%)' }),
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
          {leftLayoutDependingOnSize(true)}
          {rightLayoutDependingOnSize(true)}
        </Box>
      ) : (
        <>
          {' '}
          <TwoColumns style={{ ...props.style }}>
            {leftLayoutDependingOnSize(false)}
            {rightLayoutDependingOnSize(false)}
          </TwoColumns>
        </>
      )}{' '}
    </>
  );
};
