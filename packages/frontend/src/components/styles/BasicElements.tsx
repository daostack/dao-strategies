import { Button, Form, Text, TextInput, TextArea, Box, ButtonExtendedProps, Select, FileInput } from 'grommet';
import React, { FC } from 'react';
import styled from 'styled-components';
import { theme } from './themes';

export interface IElement {
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: JSX.Element | React.ReactNode | Array<React.ReactNode> | Array<JSX.Element> | string;
}

export interface IValueElement extends IElement {
  value?: string;
}

export interface IButton extends ButtonExtendedProps {}

export const AppButton = (props: IButton) => {
  return (
    <>
      <Button primary={props.primary} style={props.style} onClick={props.onClick}>
        <Box pad={{ vertical: 'small', horizontal: 'medium' }}>
          <Text textAlign="center" weight="bold">
            {props.children as React.ReactNode[]}
          </Text>
        </Box>
      </Button>
    </>
  );
};

export const AppForm = Form;

export const AppInput = TextInput;

export const AppTextArea = TextArea;

export const AppSelect = Select;

export const AppFileInput: FC = (props: IElement) => (
  <Box fill justify="start">
    <FileInput
      onChange={(event, el: any) => {
        const fileList = el.files;
        for (let i = 0; i < fileList.length; i += 1) {
          const file = fileList[i];
          console.log(file.name);
        }
      }}
    />
  </Box>
);

export const AppCallout = styled(Box)`
  text-align: center;
  background-color: ${(props) => props.theme.global.colors.brandLight};
  border-style: solid;
  border-width: 3px;
  border-color: ${(props) => props.theme.global.colors.brand};
  border-radius: 16px;
  padding: 16px 48px;
`;
