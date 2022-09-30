import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { styleConstants } from './styles/themes';

export const Logo: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box
      {...props}
      justify="center"
      style={{
        height: '60px',
        fontSize: styleConstants.headingFontSizes[2],
        fontWeight: '700',
        textDecoration: 'none',
        color: styleConstants.colors.headingDark,
      }}>
      CommonValue
    </Box>
  );
};
