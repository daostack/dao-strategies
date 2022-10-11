import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { constants } from './constants';

export const Banner: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const size = React.useContext(ResponsiveContext);
  const config = ((size: string): any => {
    switch (size) {
      case 'xsmall':
      case 'small':
        return {
          margin: {
            top: '12vh',
          },
        };
      case 'medium':
        return {
          margin: {
            top: '5vw',
          },
        };
      case 'large':
        return {
          margin: {
            top: '5vw',
          },
        };
      default:
        return {};
    }
  })(size);
  return (
    <Box
      {...props}
      margin={config.margin}
      style={{ borderRadius: '8px' }}
      pad="small"
      align="center"
      justify="center"
      background={constants.lightBackground}>
      Only people with Beta access can create campaigns. Ask to get Beta access
    </Box>
  );
};
