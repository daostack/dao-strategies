import { Box, BoxExtendedProps, Image, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { styleConstants } from '../styles/themes';
import { constants } from './constants';
import { TwoColumns } from './TwoColumns';

interface IBoxProps extends BoxExtendedProps {
  imagePath: string;
  description: JSX.Element;
  separatorUrl?: string;
  flip?: boolean;
}

export const HowItWorksLayoutBox: FC<IBoxProps> = (props: IBoxProps) => {
  const size = React.useContext(ResponsiveContext);
  const flip = props.flip !== undefined ? props.flip : false;

  const imageBox = (
    <Box
      style={{
        width: '25vw',
        height: '25vw',
        minWidth: '200px',
        maxWidth: '320px',
        minHeight: '200px',
        maxHeight: '320px',
        borderRadius: '50%',
        overflow: 'hidden',
        background: `url(${props.imagePath}) center no-repeat`,
        backgroundSize: 'cover',
      }}></Box>
  );

  const textBox = (
    <Box
      style={{
        color: constants.smallTextGray,
      }}>
      <Box style={{ maxWidth: '500px' }}>{props.description}</Box>
    </Box>
  );

  return (
    <Box style={{ maxWidth: '800px', margin: '0 auto' }}>
      <TwoColumns widths={flip ? ['60%', '40%'] : ['40%', '60%']}>
        <Box
          justify="center"
          align="center"
          style={{
            width: '100%',
            height: '100%',
          }}>
          {flip ? textBox : imageBox}
        </Box>
        <Box>{flip ? imageBox : textBox}</Box>
      </TwoColumns>
      {props.separatorUrl && !size.includes('small') ? (
        <Box direction="row" style={{ height: '30vw', maxHeight: '300px' }}>
          <Box style={{ height: '100%', width: '20vw', maxWidth: '150px', flexShrink: '0' }}></Box>
          <Box
            style={{
              flexGrow: '1',
              flexShrink: '1',
            }}>
            <Image fit="cover" src={props.separatorUrl}></Image>
          </Box>
          <Box style={{ height: '100%', width: '20vw', maxWidth: '150px', flexShrink: '0' }}></Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
