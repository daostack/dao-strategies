import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React, { FC, ReactNode } from 'react';
import { constants } from './constants';

interface ITwoColumns extends BoxExtendedProps {}

export const TwoColumns: FC<ITwoColumns> = (props: ITwoColumns) => {
  const size = React.useContext(ResponsiveContext);

  const config = ((size: string): any => {
    switch (size) {
      case 'xsmall':
      case 'small':
      case 'medium':
        return {
          direction: 'column',
          widths: ['100%', '100%'],
        };
      case 'large':
        return {
          direction: 'row',
          widths: ['50%', '50%'],
        };
      default:
        return {};
    }
  })(size);

  console.log({ size, config });

  const children = props.children as ReactNode[];

  return (
    <Box
      fill
      style={{
        ...props.style,
      }}
      direction={config.direction}>
      {/* Hero Message and subparagraph */}
      <Box style={{ flexGrow: 0, flexShrink: 0, width: config.widths[0] }}>{children[0]}</Box>
      <Box style={{ flexGrow: 0, flexShrink: 0, width: config.widths[1] }}>{children[1]}</Box>
    </Box>
  );
};
