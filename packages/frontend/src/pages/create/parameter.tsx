import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { styleConstants } from '../../components/styles/themes';

export interface IParameter extends BoxExtendedProps {
  label: string;
  text?: string;
}

export const Parameter: FC<IParameter> = (props: IParameter) => {
  return (
    <Box style={{ ...props.style }}>
      <Box
        style={{
          color: styleConstants.colors.ligthGrayText,
          marginBottom: '13px',
          textTransform: 'uppercase',
          fontSize: styleConstants.textFontSizes.small,
          fontWeight: '700',
        }}>
        {props.label}
      </Box>
      <Box>
        {props.text === undefined ? (
          props.children
        ) : (
          <Box style={{ fontWeight: '500', fontSize: styleConstants.textFontSizes.normal }}>{props.text}</Box>
        )}
      </Box>
    </Box>
  );
};
