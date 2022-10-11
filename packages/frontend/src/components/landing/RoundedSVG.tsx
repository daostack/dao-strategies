import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';

export const RoundedSVG: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box {...props}>
      <svg width="100vw" height="500" viewBox="0 0 1512 343" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1512 263.685C1600.02 237.099 1651 205.555 1651 171.727C1651 76.8847 1250.29 0 756 0C261.705 0 -139 76.8847 -139 171.727C-139 205.555 -88.0212 237.099 0 263.685V3664.93H1512V263.685Z"
          fill={props.color}
        />
      </svg>
    </Box>
  );
};
