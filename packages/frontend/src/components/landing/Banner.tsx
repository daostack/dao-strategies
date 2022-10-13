import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import { FC } from 'react';
import { constants } from './constants';

export interface IBannerProps extends BoxExtendedProps {
  bannerLink: string;
}

export const Banner: FC<IBannerProps> = (props: IBannerProps) => {
  const bannerLink = props.bannerLink ?? 'https://t.me/+a0mIY6gHOG00OGU0';
  return (
    <Box
      style={{ borderRadius: '8px', padding: '18px', ...props.style }}
      align="center"
      justify="center"
      background={constants.lightBackground}>
      <div>
        Only people with Beta access can create campaigns. Ask to{' '}
        <a
          style={{ display: 'inline-block', color: constants.purpleText }}
          href={bannerLink}
          target="_blank"
          rel="noreferrer">
          get Beta access
        </a>
      </div>
    </Box>
  );
};
