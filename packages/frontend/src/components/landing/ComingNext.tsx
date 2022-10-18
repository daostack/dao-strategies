import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { constants } from './constants';

import { AppHeading, AppLabel } from '../styles/BasicElements';
import { useMainContext } from '../../pages/MainPage';

interface IBoxProps extends BoxExtendedProps {
  iconPath: string;
  name: string;
}

const Platform: FC<IBoxProps> = (props: IBoxProps) => {
  const { scaleText } = useMainContext();
  const textSize = scaleText(constants.mediumSize);

  return (
    <Box style={{ ...props.style, padding: '16px 16px' }}>
      <Box
        direction="row"
        align="center"
        justify="center"
        style={{
          textAlign: 'center',
          backgroundColor: constants.lightGray,
          padding: '30px',
          borderRadius: '8px',
        }}>
        <Box>
          <img style={{ height: '32px', width: '32px' }} src={props.iconPath} alt="logo"></img>
        </Box>
        <AppLabel
          style={{
            textTransform: 'inherit',
            marginLeft: '8px',
            fontSize: textSize,
            color: constants.blackText,
          }}>
          {props.name}
        </AppLabel>
      </Box>
    </Box>
  );
};

export const ComingNext: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const { scaleText, responsiveStyle } = useMainContext();
  const textSize = scaleText(constants.headingSize);
  const boxStyle = responsiveStyle([
    ['xsmall', { width: '100%' }],
    [['small', 'medium'], { width: '50%' }],
    ['large', { width: '25%' }],
  ]);

  return (
    <Box
      style={{
        width: '100%',
        padding: '1vw',
        backgroundColor: constants.lightBackground,
        ...props.style,
      }}
      align="center">
      <Box alignSelf="start" style={{ marginLeft: '12px', marginBottom: '36px' }}>
        <AppHeading size={textSize}>
          -Coming Soon- <span style={{ color: constants.comingSoonGrayText }}>New Integrations</span>
        </AppHeading>
      </Box>
      <Box
        direction="row"
        align="start"
        style={{
          width: '100%',
        }}
        wrap={true}>
        <Platform iconPath="/images-landing/Twitter.svg" style={boxStyle} name="Twitter"></Platform>
        <Platform iconPath="/images-landing/eth.svg" style={boxStyle} name="Ethereum"></Platform>
        <Platform iconPath="/images-landing/Notion.svg" style={boxStyle} name="Notion"></Platform>
        <Platform iconPath="/images-landing/Discord.svg" style={boxStyle} name="Discord"></Platform>
      </Box>
    </Box>
  );
};
