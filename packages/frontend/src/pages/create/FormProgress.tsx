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

  const circles = (selected: boolean, ix: number) => {
    const bg = selected ? theme.primary : styleConstants.colors.lightGrayBorder;
    return (
      <Box
        align="center"
        justify="center"
        onClick={() => clicked(ix)}
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
    <Box style={{ width: '100%', ...props.style }}>
      <Box style={{ width: '100%' }} direction="row" align="center">
        {props.stations.map((station, ix) => {
          const selected = ix <= props.position;
          const color = selected ? theme.primary : styleConstants.colors.ligthGrayText;
          return (
            <>
              <Box style={{ width: `${height}px`, position: 'relative', overflow: 'visible' }}>
                {circles(selected, ix)}
                <Box
                  style={{
                    position: 'absolute',
                    bottom: '-24px',
                    minWidth: '100px',
                    fontSize: '12px',
                    color: color,
                    userSelect: 'none',
                  }}
                  onClick={() => clicked(ix)}>
                  {station.description}
                </Box>
              </Box>
              {ix < props.stations.length - 1 ? line(ix < props.position) : <></>}
            </>
          );
        })}
      </Box>
      {/* Empty space to cover the space from the absolute-positioned descriptions */}
      <Box style={{ width: '100%', height: '24px' }}></Box>
    </Box>
  );
};
