import { Box, Image, BoxExtendedProps } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { Logo } from '../Logo';

import { AppHeading, AppLabel } from '../styles/BasicElements';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IFooterIcon extends BoxExtendedProps {
  imageSrc: string;
  itemText: string;
  itemLink: string;
}

const FooterItem: FC<IFooterIcon> = (props: IFooterIcon) => {
  const { imageSrc, itemText, itemLink } = props;

  return (
    <a style={{ textDecoration: 'none' }} href={itemLink} target="_blank" rel="noreferrer">
      <Box direction="row" gap="12px" align="center" justify="center" style={{ ...props.style }}>
        {imageSrc && <Image src={imageSrc}></Image>}
        <AppLabel style={{ color: constants.blackText }}>{itemText}</AppLabel>
      </Box>
    </a>
  );
};

interface IFooter extends BoxExtendedProps {}

export const Footer: FC<IFooter> = (props: IFooter) => {
  return (
    <TwoColumns
      align="start"
      justify="start"
      widths={['35%', '65%']}
      style={{
        padding: '6vw 3vw',
        ...props.style,
      }}>
      {/* Logo */}
      <Box>
        <Logo></Logo>
      </Box>

      {/* Follow us and Resources */}
      <Box align="start" justify="start" direction="row" gap="10vw">
        {/* Follow us box */}
        <Box>
          <AppHeading size="28px">Follow Us</AppHeading>
          <Box pad={{ vertical: 'medium' }} gap="18px">
            <FooterItem imageSrc="images-landing/Footer/Twitter.png" itemText="Twitter" itemLink="" />
            <FooterItem imageSrc="images-landing/Footer/Discord.png" itemText="Discord" itemLink="" />
            <FooterItem imageSrc="images-landing/Footer/Github.png" itemText="Github" itemLink="" />
          </Box>
        </Box>
        {/* Resources box */}
        <Box>
          <AppHeading size="28px">Resources</AppHeading>
          <Box pad={{ vertical: 'medium' }} gap="18px">
            <FooterItem imageSrc="" itemText="Docs" itemLink="" />
            <FooterItem imageSrc="" itemText="Blog" itemLink="" />
          </Box>
        </Box>
      </Box>
    </TwoColumns>
  );
};
