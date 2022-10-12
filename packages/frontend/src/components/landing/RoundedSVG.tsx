import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';

export const RoundedSVG: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box {...props}>
      <svg width="100%" height="98" viewBox="0 0 1512 81" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2164_21542)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M756 343.454C1250.29 343.454 1651 266.569 1651 171.727C1651 76.8847 1250.29 0 756 0C261.705 0 -139 76.8847 -139 171.727C-139 266.569 261.705 343.454 756 343.454Z"
            fill={props.color}
          />
        </g>
        <defs>
          <clipPath id="clip0_2164_21542">
            <rect width="100%" height="98" fill={props.color} />
          </clipPath>
        </defs>
      </svg>
    </Box>
  );
};
