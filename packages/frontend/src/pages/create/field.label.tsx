import { Box, BoxExtendedProps, DropButton } from 'grommet';
import { CircleQuestion } from 'grommet-icons';
import { FC, ReactElement } from 'react';
import { HelpTip } from '../../components/styles/BasicElements';

export interface IFieldLabel extends BoxExtendedProps {
  label: string;
  required?: boolean;
  help?: string | ReactElement;
}

export const FieldLabel: FC<IFieldLabel> = (props: IFieldLabel) => {
  const required = props.required !== undefined ? props.required : false;

  return (
    <Box direction="row" align="center" style={{ ...props.style }}>
      <Box>
        <span>
          {required ? <span style={{ color: 'red', marginRight: '4px' }}>*</span> : <></>}
          {props.label}
        </span>
      </Box>
      {props.help ? <HelpTip content={props.help}></HelpTip> : <></>}
    </Box>
  );
};
