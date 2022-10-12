import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { HEADER_HEIGHT } from '../../pages/AppHeader';
import { constants } from './constants';

export interface IBannerProps extends BoxExtendedProps {
  bannerLink: string;
}

export const Banner: FC<IBannerProps> = (props: IBannerProps) => {
  const bannerLink = props.bannerLink ?? 'https://t.me/+a0mIY6gHOG00OGU0';
  return (
    <Box
      {...props}
      direction="row"
      gap="3px"
      style={{ borderRadius: '8px', margin: '32px 0px 0px 0px', padding: '18px' }}
      align="center"
      justify="center"
      background={constants.lightBackground}>
      Only people with Beta access can create campaigns. Ask to{' '}
      <a style={{ display: 'inline-block', color: constants.purpleText }} href={bannerLink}>
        get Beta access
      </a>
    </Box>
  );
};
