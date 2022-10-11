import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import React, { FC, ReactNode } from 'react';
import { constants } from './constants';

interface ITwoColumns extends BoxExtendedProps {
  mediumIsSmall?: boolean;
  widths?: string[];
}

export const TwoColumns: FC<ITwoColumns> = (props: ITwoColumns) => {
  const size = React.useContext(ResponsiveContext);

  const config = ((size: string): any => {
    const small = {
      direction: 'column',
      widths: ['100%', '100%'],
    };

    switch (size) {
      case 'xsmall':
      case 'small':
        return small;
      case 'medium':
      case 'large':
        if (props.mediumIsSmall !== undefined && props.mediumIsSmall) {
          if (size === 'medium') {
            return small;
          }
        }

        return {
          direction: 'row',
          widths: props.widths ? props.widths : ['50%', '50%'],
        };
      default:
        return {};
    }
  })(size);

  const children = props.children as ReactNode[];

  console.log({ children });

  return (
    <Box
      fill
      style={{
        ...props.style,
      }}
      direction={config.direction}>
      {/* Hero Message and subparagraph */}
      <Box style={{ flexGrow: 0, flexShrink: 0, width: config.widths[0] }} justify="center" align="center">
        {children[0]}
      </Box>
      <Box style={{ flexGrow: 0, flexShrink: 0, width: config.widths[1] }} justify="center" align="center">
        {children[1]}
      </Box>
    </Box>
  );
};
