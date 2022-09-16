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
  Layer,
  Heading,
  TextAreaProps,
} from 'grommet';
import { Close, FormDown, FormUp } from 'grommet-icons';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { styleConstants, theme } from './themes';

export interface IElement {
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: JSX.Element | React.ReactNode | Array<React.ReactNode> | Array<JSX.Element> | string;
}

export const AppTag: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box
      direction="row"
      align="center"
      style={{
        borderRadius: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: '6.5px 16px',
        ...props.style,
      }}>
      {props.children}
    </Box>
  );
};

export interface IValueElement extends IElement {
  value?: string;
}

export interface IButton extends ButtonExtendedProps {}

export const AppButton = (props: IButton) => {
  return (
    <>
      <Button primary={props.primary} style={props.style} disabled={props.disabled} onClick={props.onClick}>
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
    border: 1px solid;
    border-radius: 20px;
    height: 40px;
    border-color: ${styleConstants.colors.lightGrayBorder};
    padding-left: 16px;
    font-weight: normal;
  }
`;

export const AppTextArea: FC<TextAreaProps> = (props: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>();

  const autosize = () => {
    if (ref.current === undefined) {
      return;
    }

    if (ref.current.value === '') {
      ref.current.style.height = '0px';
      return;
    }

    if (ref.current.scrollHeight > ref.current.clientHeight) {
      console.log('ref');
      ref.current.style.height = `${ref.current.scrollHeight + 20}px`;
    }
  };

  const onchange = () => {
    autosize();
  };

  if (ref === null || ref === undefined) {
    return <></>;
  }

  return (
    <TextArea
      onChange={() => onchange()}
      ref={ref as any}
      {...props}
      style={{
        overflow: 'hidden',
        border: '1px solid',
        borderRadius: '20px',
        paddingLeft: '16px',
        borderColor: styleConstants.colors.lightGrayBorder,
        fontWeight: 'normal',
        resize: 'vertical',
        minHeight: '100px',
      }}></TextArea>
  );
};

export const AppSelect = styled(Select)`
  border-color: ${styleConstants.colors.lightGrayBorder};
  font-weight: normal;
  padding: 8px 16px;
`;

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

export const HorizontalLine: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box
      style={{
        width: '100%',
        height: '1px',
        backgroundColor: `${styleConstants.colors.lightGrayBorder}`,
        ...props.style,
      }}></Box>
  );
};

export const AppCallout = styled(Box)`
  text-align: center;
  background-color: ${(props) => props.theme.global.colors.brandLight};
  border-style: solid;
  border-width: 3px;
  border-color: ${(props) => props.theme.global.colors.brand};
  border-radius: 16px;
  padding: 16px 48px;
`;

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FBFDFC',
  border: 'solid 1px',
  borderColor: styleConstants.colors.lightGrayBorder,
  padding: '16px 24px',
  borderRadius: '8px',
  minHeight: '122px',
};

interface AppCardProps extends BoxExtendedProps {}

export const AppCard: FC<AppCardProps> = (props: AppCardProps) => {
  return (
    <Box
      {...props}
      style={{
        ...cardStyle,
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

interface IExpansibleCard extends BoxExtendedProps {
  hiddenPart: React.ReactElement | React.ReactElement[];
  padding?: number[];
}

export const ExpansibleCard: FC<IExpansibleCard> = (props: IExpansibleCard) => {
  const [expanded, setExpanded] = useState(false);
  const padding = props.padding ? props.padding : [0, 0, 0, 0];

  const circleStyle: React.CSSProperties = {
    borderRadius: '15px',
    border: 'solid 1px',
    borderColor: styleConstants.colors.lightGrayBorder,
    backgroundColor: 'white',
    height: '30px',
    width: '30px',
  };

  const iconStyle: React.CSSProperties = { height: '20px', width: '20px' };

  return (
    <Box
      {...props}
      style={{
        ...cardStyle,
        ...props.style,
        position: 'relative',
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
      }}>
      {props.children}
      {expanded ? props.hiddenPart : <></>}

      <Box
        fill
        align="center"
        onClick={() => setExpanded(!expanded)}
        style={{
          height: '30px',
          position: 'absolute',
          paddingTop: '3px',
          bottom: '-15px',
          cursor: 'pointer',
          width: `calc(100% - ${padding[1]}px - ${padding[3]}px)`,
        }}>
        {expanded ? (
          <Box align="center" justify="center" style={{ ...circleStyle }}>
            <FormUp style={{ ...iconStyle }}></FormUp>
          </Box>
        ) : (
          <Box align="center" justify="center" style={{ ...circleStyle }}>
            <FormDown style={{ ...iconStyle }}></FormDown>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export interface IFixedHeightPar extends BoxExtendedProps {
  content: ReactElement;
}

export const FixedHeightPar: FC<IFixedHeightPar> = (props: IFixedHeightPar) => {
  const [showGradient, setShowGradient] = useState<boolean>(true);

  return (
    <Box style={{ height: '50px', overflow: 'hidden', position: 'relative', ...props.style }}>
      {props.content}
      {showGradient ? (
        <Box
          direction="row"
          justify="end"
          style={{
            height: '24px',
            width: '120px',
            background:
              'linear-gradient(to right, rgb(255, 255, 255, 0), rgb(255, 255, 255, 0), rgb(255, 255, 255, 1), rgb(255, 255, 255, 1))',
            position: 'absolute',
            bottom: '0px',
            right: '0px',
          }}>
          <Box style={{ marginRight: '24px' }}>. . .</Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

interface INumberedRow extends IElement {
  number: number;
  text: React.ReactNode;
  disabled?: boolean;
  hideLine?: boolean;
}

export const NumberedRow: FC<INumberedRow> = (props: INumberedRow) => {
  return (
    <Box direction="row" style={{ position: 'relative' }}>
      {props.disabled ? (
        <Box
          fill
          style={{
            zIndex: '2',
            backgroundColor: 'rgba(153, 156, 154, 0.4)',
            position: 'absolute',
            top: '0',
            left: '0',
          }}></Box>
      ) : (
        <></>
      )}
      <Box style={{ width: '28px', marginRight: '24px' }}>
        <Box
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: props.disabled ? theme.primaryLight : theme.buttonLightBorder,
            color: props.disabled ? '#6D6D6D' : theme.primary,
            textAlign: 'center',
          }}>
          {props.number}
        </Box>
        <Box fill style={{ padding: '8px 0px' }} align="center">
          {props.hideLine ? (
            <></>
          ) : (
            <Box
              fill
              style={{
                width: '1.5px',
                backgroundColor: '#ccc',
              }}></Box>
          )}
        </Box>
      </Box>
      <Box fill>
        <Text>{props.text}</Text>
        <Box style={{ padding: '16px 0px 40px 0px' }}>{props.children}</Box>
      </Box>
    </Box>
  );
};

export interface IInfoProperty extends BoxExtendedProps {
  title: string;
}

export const InfoProperty: FC<IInfoProperty> = (props: IInfoProperty) => {
  return (
    <Box style={{ ...props.style }}>
      <Box
        style={{
          textTransform: 'uppercase',
          fontSize: '14px',
          color: styleConstants.colors.ligthGrayText,
          marginBottom: '12px',
        }}>
        {props.title}
      </Box>
      <Box>{props.children}</Box>
    </Box>
  );
};

export interface IAppModal extends BoxExtendedProps {
  heading: string;
  onClosed?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export const AppModal: FC<IAppModal> = (props: IAppModal) => {
  const child = React.cloneElement(props.children as React.ReactElement, {
    onSuccess: props.onSuccess,
    onClosed: props.onClosed,
    onError: props.onError,
  });

  const close = () => {
    if (props.onClosed) props.onClosed();
  };

  return (
    <Layer position="right" onEsc={() => close()} onClickOutside={() => close()}>
      <Box style={{ padding: '5vh 2.5vw', height: '100vh', minWidth: '35vw', maxWidth: '600px' }}>
        <Box style={{ marginBottom: '20px' }} onClick={() => close()}>
          <Close style={{ height: '12px', width: '12px' }}></Close>
        </Box>
        <Heading style={{ fontSize: styleConstants.headingFontSizes[1] }}>{props.heading}</Heading>
        {child}
      </Box>
    </Layer>
  );
};
