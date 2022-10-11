import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { HEADER_HEIGHT } from '../../pages/AppHeader';
import { constants } from './constants';

export const Banner: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box
      {...props}
      style={{ borderRadius: '8px', margin: '32px 0px 0px 0px', padding: '18px' }}
      align="center"
      justify="center"
      background={constants.lightBackground}>
      Only people with Beta access can create campaigns. Ask to get Beta access
    </Box>
  );
};
