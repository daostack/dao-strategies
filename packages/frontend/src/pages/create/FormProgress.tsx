import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';

import { styleConstants, theme } from '../../components/styles/themes';

export interface IFormProgress extends BoxExtendedProps {
  position: number;
  stations: Array<{
    description: string;
  }>;
  onSelected?: (position: number) => void;
}

export const FormProgress: FC<IFormProgress> = (props: IFormProgress) => {
  const height = 16;
  const lineWidth = 2;

  const clicked = (ix: number) => {
    if (props.onSelected) {
      props.onSelected(ix);
    }
  };

  const line = (selected: boolean) => {
    const color = selected ? theme.primary : styleConstants.colors.lightGrayBorder;
    return <Box style={{ height: lineWidth, backgroundColor: color, flexGrow: '1' }}></Box>;
  };

  const circles = (selected: boolean) => {
    const bg = selected ? theme.primary : styleConstants.colors.lightGrayBorder;
    return (
      <Box
        align="center"
        justify="center"
        style={{
          flexGrow: '0',
          height: `${height}px`,
          width: `${height}px`,
          borderRadius: `${height / 2}px`,
          backgroundColor: bg,
        }}>
        <Box
          align="center"
          justify="center"
          style={{
            height: `${height * 0.75}px`,
            width: `${height * 0.75}px`,
            borderRadius: `${height / 2}px`,
            backgroundColor: 'white',
          }}>
          <Box
            style={{
              height: `${height * 0.5}px`,
              width: `${height * 0.5}px`,
              borderRadius: `${height / 2}px`,
              backgroundColor: bg,
            }}></Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box style={{ width: '100%', ...props.style }} direction="row" align="center">
      {props.stations.map((station, ix) => {
        return (
          <>
            {circles(ix <= props.position)}
            {ix < props.stations.length - 1 ? line(ix < props.position) : <></>}
          </>
        );
      })}
    </Box>
  );
};
