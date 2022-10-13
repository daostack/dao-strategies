import { Box, BoxExtendedProps, Image } from 'grommet';
import { FC } from 'react';
import { styleConstants } from './styles/themes';

interface ILogo extends BoxExtendedProps {
  compact?: boolean;
}

export const Logo: FC<ILogo> = (props: ILogo) => {
  const compact = props.compact !== undefined ? props.compact : false;
  return (
    <Box
      {...props}
      justify="center"
      align="center"
      direction="row"
      gap="14px"
      style={{
        height: '60px',
        fontSize: styleConstants.headingFontSizes[2],
        fontWeight: '700',
        textDecoration: 'none',
        color: styleConstants.colors.headingDark,
      }}>
      <Image width="32" height="32" src="/favicon-32x32.png" />
      {compact ? <></> : 'CommonValue'}
    </Box>
  );
};
