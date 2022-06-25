import { Box, Grid } from 'grommet';
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

export const TwoColumns = (props: IElement) => {
  return (
    <Grid
      fill
      columns={['1/2', '1/2']}
      rows={['auto']}
      areas={[
        { name: 'left', start: [0, 0], end: [0, 0] },
        { name: 'right', start: [1, 0], end: [1, 0] },
      ]}
      {...props}>
      <Box
        gridArea="left"
        direction="column"
        align="center"
        justify="start"
        pad={{ horizontal: 'none', vertical: 'small' }}>
        {(props.children as React.ReactNode[])[0]}
      </Box>
      <Box
        gridArea="right"
        direction="column"
        align="center"
        justify="start"
        pad={{ horizontal: 'none', vertical: 'small' }}>
        {(props.children as React.ReactNode[])[1]}
      </Box>
    </Grid>
  );
};
