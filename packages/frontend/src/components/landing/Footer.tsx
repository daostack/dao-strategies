import { Box, Image, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { Logo } from '../Logo';

import { AppHeading, AppLabel } from '../styles/BasicElements';
import { styleConstants } from '../styles/themes';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IFooterIcon extends BoxExtendedProps {
  imageSrc: string;
  itemText: string;
  itemLink?: string;
  soon?: boolean;
}

const FooterItem: FC<IFooterIcon> = (props: IFooterIcon) => {
  const { imageSrc, itemText, itemLink } = props;
  const soon = props.soon !== undefined ? props.soon : false;

  const el = (
    <Box direction="row" align="center" justify="center" style={{ ...props.style }}>
      <Box style={{ width: '30px', flexShrink: '0' }}>
        {imageSrc && <Image style={{ height: '30px', width: '30px' }} src={imageSrc}></Image>}
      </Box>
      <Box style={{ color: !soon ? constants.blackText : styleConstants.colors.lightGrayTextDarker }}>{itemText}</Box>
      {soon ? <Box style={{ marginLeft: '4px', fontSize: styleConstants.textFontSizes.xsmall }}>(soon)</Box> : ''}
    </Box>
  );

  return props.itemLink && !soon ? (
    <a style={{ textDecoration: 'none' }} href={itemLink} target="_blank" rel="noreferrer">
      {el}
    </a>
  ) : (
    el
  );
};

interface IFooter extends BoxExtendedProps {}

export const Footer: FC<IFooter> = (props: IFooter) => {
  return (
    <Box style={{ width: '100%' }} align="center">
      <Box style={{ height: '6vw', maxHeight: '150px' }}></Box>
      <TwoColumns
        align="start"
        justify="start"
        widths={['35%', '65%']}
        style={{
          ...props.style,
        }}>
        {/* Logo */}
        <Box align="center">
          <Box style={{ height: '3vw', maxHeight: '200px', minHeight: '20px' }}></Box>
          <Logo></Logo>
          <Box style={{ height: '3vw', maxHeight: '250px', minHeight: '50px' }}></Box>
        </Box>

        {/* Follow us and Resources */}
        <Box align="start" justify="center" direction="row" gap="10vw">
          {/* Follow us box */}
          <Box>
            <AppHeading size="28px">Follow Us</AppHeading>
            <Box pad={{ vertical: 'medium' }} gap="8px" align="start">
              <FooterItem
                imageSrc="/images-landing/Footer/Twitter.png"
                itemText="Twitter"
                itemLink="https://twitter.com/commonvalue_xyz"
              />
              <FooterItem imageSrc="/images-landing/Footer/Discord.png" itemText="Discord" soon />
              <FooterItem imageSrc="/images-landing/Footer/Github.png" itemText="Github" soon />
            </Box>
          </Box>
          {/* Resources box */}
          <Box>
            <AppHeading size="28px">Resources</AppHeading>
            <Box pad={{ vertical: 'medium' }} gap="8px" align="start">
              <FooterItem imageSrc="" itemText="Blog" itemLink="https://mirror.xyz/commonvalue.eth" />
            </Box>
          </Box>
        </Box>
      </TwoColumns>
      <Box style={{ height: '6vw', maxHeight: '150px' }}></Box>
    </Box>
  );
};
