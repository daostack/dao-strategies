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
import { FC } from 'react';
import { IElement } from './BasicElements';

export const ViewportContainer: FC<any> = (props: IElement) => {
  return (
    <div style={{ height: '100vh' }}>
      <Box fill align="center" justify="center">
        {props.children}
      </Box>
    </div>
  );
};

export const ColumnView: FC<any> = (props: IElement) => {
  return (
    <Box style={{ maxWidth: '900px', margin: '0 auto' }} align="center">
      {props.children}
    </Box>
  );
};

export interface ITwoColumns extends BoxExtendedProps {}

export const TwoColumns: FC<ITwoColumns> = (props: ITwoColumns) => {
  return (
    <Grid
      fill
      columns={['1/2', '1/2']}
      rows={['auto']}
      areas={[
        { name: 'left', start: [0, 0], end: [0, 0] },
        { name: 'right', start: [1, 0], end: [1, 0] },
      ]}
      style={{ ...props.style }}>
      <Box gridArea="left" direction="column" align={props.align} justify={props.justify}>
        {(props.children as React.ReactNode[])[0]}
      </Box>
      <Box gridArea="right" direction="column" align={props.align} justify={props.justify}>
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
