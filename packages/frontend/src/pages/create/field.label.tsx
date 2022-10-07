import { Box, BoxExtendedProps, DropButton } from 'grommet';
import { CircleQuestion } from 'grommet-icons';
import { FC, ReactElement } from 'react';

export const HelpDrop: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return <Box style={{ padding: '21px 16px', fontSize: '12px' }}>{props.children}</Box>;
};

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

      {props.help !== undefined ? (
        <DropButton
          style={{ marginLeft: '9px' }}
          dropContent={<HelpDrop>{props.help}</HelpDrop>}
          dropProps={
            { margin: '10px', align: { bottom: 'top' }, style: { borderRadius: '20px', maxWidth: '280px' } } as any
          }>
          <Box justify="center" style={{ overflow: 'hidden' }}>
            <CircleQuestion style={{ height: '13.33px', width: '13.33px' }}></CircleQuestion>
          </Box>
        </DropButton>
      ) : (
        <></>
      )}
    </Box>
  );
};
