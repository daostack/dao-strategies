import { Box, BoxExtendedProps, Image, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { styleConstants } from '../styles/themes';
import { constants } from './constants';


interface IBoxProps extends BoxExtendedProps {
  imagePath: string;
  description: JSX.Element;
  imagePosition?: string
}

export const HowItWorksLayoutBox: FC<IBoxProps> = (props: IBoxProps) => {

  const size = React.useContext(ResponsiveContext);
  const imagePosition = props.imagePosition ?? 'left'
  const config = ((size: string): any => {
    switch (size) {
      case 'xsmall':
      case 'small':
        return {
          direction: 'column',
          widths: ['100%', '100%'],
          justifyText: 'center',
          alignText: 'center',
        };
      case 'medium':
      case 'large':
        return {
          direction: 'row',
          widths: ['50%', '50%'],
          justifyText: 'center',
          alignText: 'center',
        };
      default:
        return {};
    }
  })(size);

  const imageBox = (<Box
    margin={{ bottom: '16px', right: '10vw', left: '10vw' }}
    style={{
      width: "25vw",
      height: "25vw",
      minWidth: '200px',
      maxWidth: '380px',
      minHeight: '200px',
      maxHeight: '380px',
      overflow: 'hidden',
    }}

  >
    <Image fit="cover" style={{ borderRadius: '50%' }} src={props.imagePath} />
  </Box>)

  const textBox = (<Box
    style={{
      width: config.widths[0],
      color: constants.smallTextGray,
      textAlign: config.justifyText
    }}>
    <Box style={{ maxWidth: '420px' }}>{props.description}</Box>
  </Box>)

  return (
    <Box direction={config.direction}
      justify={config.justifyText}
      align={config.alignText}
      pad={{ vertical: '20px', horizontal: '15vw' }}
      style={{ width: '100%', ...props.style }}>
      {imagePosition === 'left' ? (<>{imageBox} {textBox}</>) : (<>{textBox} {imageBox} </>)}
    </Box>
  );
};

