import { Box, Image, BoxExtendedProps } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { Logo } from '../Logo';

import { AppHeading, AppLabel } from '../styles/BasicElements';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IFooter extends BoxExtendedProps {}

export const Footer: FC<IFooter> = (props: IFooter) => {
  const returnFooterItem = (imageSrc: string, itemText: string, itemLink: string): JSX.Element => {
    if (!itemLink || !itemText) return <></>;

    return (
      <Box direction="row" gap="12px" align="center" justify="center">
        {imageSrc && <Image src={imageSrc}></Image>}
        <a style={{ textDecoration: 'none' }} href={itemLink}>
          <AppLabel style={{ color: constants.blackText }}>{itemText}</AppLabel>
        </a>
      </Box>
    );
  };
  return (
    <TwoColumns
      align="start"
      justify="start"
      widths={['35%', '65%']}
      style={{
        ...props.style,
      }}>
      {/* Logo */}
      <Box>
        <Logo></Logo>
      </Box>

      {/* Follow us and Resources */}
      <Box align="start" justify="start" direction="row" gap="10vw">
        {/* Follow us box */}
        <Box pad={{ vertical: 'medium' }}>
          <AppHeading size="28px">Follow Us</AppHeading>
          <Box pad={{ vertical: 'medium' }} gap="18px">
            {returnFooterItem('images-landing/Footer/Twitter.png', 'Twitter', '#')}
            {returnFooterItem('images-landing/Footer/Discord.png', 'Discord', '#')}
            {returnFooterItem('images-landing/Footer/Github.png', 'Github', '#')}
          </Box>
        </Box>
        {/* Resources box */}
        <Box pad={{ vertical: 'medium' }}>
          <AppHeading size="28px">Resources</AppHeading>
          <Box pad={{ vertical: 'medium' }} gap="18px">
            {returnFooterItem('', 'Docs', '#')}
            {returnFooterItem('', 'Blog', '#')}
          </Box>
        </Box>
      </Box>
    </TwoColumns>
  );
};
