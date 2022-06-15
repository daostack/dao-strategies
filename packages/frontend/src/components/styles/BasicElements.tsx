import { Button, Form, Text, TextInput, TextArea, Box, ButtonExtendedProps, Select } from 'grommet';
import React from 'react';

export interface IElement {
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: Array<React.ReactNode> | string;
}

export interface IValueElement extends IElement {
  value?: string;
}

export interface IButton extends ButtonExtendedProps {}

export const AppButton = (props: IButton) => {
  return (
    <>
      <Button primary={props.primary} style={props.style}>
        <Box pad={{ vertical: 'small', horizontal: 'medium' }}>
          <Text weight="bold">{props.children as React.ReactNode[]}</Text>
        </Box>
      </Button>
    </>
  );
};

export const AppForm = Form;

export const AppInput = TextInput;

export const AppTextArea = TextArea;

export const AppSelect = Select;
