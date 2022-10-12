import { Box, BoxExtendedProps, Image } from 'grommet';
import { FC } from 'react';

export const RoundedSVG: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box {...props}>
      <Image fit="cover" src="/images-landing/Ellipse.png" width="100%" height="auto" />
      {/* <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg">
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
            <rect height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill={props.color} />
          </clipPath>
        </defs>
      </svg> */}
    </Box>
  );
};
