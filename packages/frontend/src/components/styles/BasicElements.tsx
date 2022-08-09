import {
  Button,
  Form,
  Text,
  TextInput,
  TextArea,
  Box,
  ButtonExtendedProps,
  Select,
  FileInput,
  BoxExtendedProps,
  Paragraph,
  ParagraphProps,
} from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
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

export const AppInput = styled(TextInput)`
  & {
    height: 40px;
  }
`;

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

interface AppCardProps extends BoxExtendedProps {}

export const AppCard: FC<AppCardProps> = (props: AppCardProps) => {
  return (
    <Box
      {...props}
      style={{
        backgroundColor: '#FBFDFC',
        border: 'solid 1px  #F0EDED',
        padding: '16px 24px',
        borderRadius: '8px',
        minHeight: '122px',
        ...props.style,
      }}>
      {props.children}
    </Box>
  );
};

interface IExpansibleParagraph extends IElement {
  maxHeight: number;
}

export const ExpansiveParagraph: FC<IExpansibleParagraph> = (props: IExpansibleParagraph) => {
  const [parHeight, setParHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref !== null && ref.current !== null) {
      setParHeight(ref.current.clientHeight);
    }
  }, []);

  const showExpand = parHeight > props.maxHeight;

  return (
    <Box
      style={{
        height: expanded ? 'auto' : `${props.maxHeight}px`,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}>
      <p ref={ref} style={{ width: '100%', lineHeight: '200%', paddingBottom: '24px' }}>
        {props.children}
      </p>
      {showExpand ? (
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'end',
            fontWeight: '700',
            padding: '0px 0px 10px 0px',
            position: 'absolute',
            width: '100%',
            left: '0',
            bottom: '0',
            height: '120px',
            cursor: 'pointer',
            backgroundColor: 'red',
            background: `${
              expanded
                ? 'none'
                : 'linear-gradient(to bottom, rgb(255, 255, 255, 0), rgb(255, 255, 255, 1), rgb(255, 255, 255, 1), rgb(255, 255, 255, 1))'
            }`,
          }}>
          See more {expanded ? <FormUp></FormUp> : <FormDown></FormDown>}
        </div>
      ) : (
        <></>
      )}
    </Box>
  );
};

interface INumberedRow extends IElement {
  number: number;
  text: React.ReactNode;
}

export const NumberedRow: FC<INumberedRow> = (props: INumberedRow) => {
  return (
    <Box direction="row">
      <Box style={{ width: '28px', marginRight: '24px' }}>
        <Box
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: theme.buttonLightBorder,
            color: theme.primary,
            textAlign: 'center',
          }}>
          {props.number}
        </Box>
        <Box fill style={{ padding: '8px 0px' }} align="center">
          <Box
            fill
            style={{
              width: '1.5px',
              backgroundColor: '#ccc',
            }}></Box>
        </Box>
      </Box>
      <Box fill>
        <Text>{props.text}</Text>
        <Box style={{ padding: '16px 0px 40px 0px' }}>{props.children}</Box>
      </Box>
    </Box>
  );
};
