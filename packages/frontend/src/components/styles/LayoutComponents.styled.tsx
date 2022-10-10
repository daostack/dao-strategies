import {
  AreasType,
  Box,
  BoxExtendedProps,
  Grid,
  GridColumnsType,
  GridExtendedProps,
  GridSizeType,
  ResponsiveContext,
} from 'grommet';
import { FC, ReactNode } from 'react';
import { IElement } from './BasicElements';
import { styleConstants } from './themes';

export const ViewportContainer: FC<any> = (props: IElement) => {
  return (
    <div style={{ height: '100vh' }}>
      <Box fill align="center" justify="center">
        {props.children}
      </Box>
    </div>
  );
};

export interface ITwoColumns {
  children?: ReactNode | ReactNode[];
  grid?: GridExtendedProps;
  boxes?: BoxExtendedProps;
  gap?: number;
  line?: boolean;
  frs?: number[];
}

export const TwoColumns: FC<ITwoColumns> = (props: ITwoColumns) => {
  const gap = props.gap !== undefined ? props.gap : 78; // minus 2 of the line
  const showLine = props.line !== undefined ? props.line : true;
  const frs = props.frs || [1, 1];

  const colWidths = [`${frs[0]}fr`, `${frs[1]}fr`];

  return (
    <Grid
      fill
      columns={[colWidths[0], `${gap}px`, colWidths[1]]}
      rows={['auto']}
      areas={[
        { name: 'left', start: [0, 0], end: [0, 0] },
        { name: 'center', start: [1, 0], end: [1, 0] },
        { name: 'right', start: [2, 0], end: [2, 0] },
      ]}
      style={{ ...props.grid?.style }}>
      <Box gridArea="left" direction="column" {...props.boxes}>
        {(props.children as React.ReactNode[])[0]}
      </Box>
      <Box gridArea="center" align="center">
        {showLine ? (
          <Box
            style={{
              height: '100%',
              width: '2px',
              backgroundColor: styleConstants.colors.lightGrayBorder,
            }}></Box>
        ) : (
          <></>
        )}
      </Box>
      <Box gridArea="right" direction="column" {...props.boxes}>
        {(props.children as React.ReactNode[])[1]}
      </Box>
    </Grid>
  );
};

export enum Breakpoint {
  small = 'small',
  medium = 'medium',
  large = 'large',
  xlarge = 'xlarge',
}

export interface IResponsiveGrid extends GridExtendedProps {
  columnsAt: Record<Breakpoint, GridColumnsType>;
  rowsAt: Record<Breakpoint, GridSizeType | GridSizeType[]>;
  areasAt?: Record<Breakpoint, AreasType>;
}

export const ResponsiveGrid: FC<IResponsiveGrid> = (props: IResponsiveGrid) => (
  <ResponsiveContext.Consumer>
    {(_size) => {
      const size = _size as Breakpoint;

      const columnsVal = props.columnsAt[size];
      const rowsVal = props.rowsAt[size];
      const areasVal = props.areasAt ? props.areasAt[size] : undefined;

      return (
        <Grid {...props} rows={rowsVal} columns={columnsVal} areas={areasVal}>
          {props.children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);
