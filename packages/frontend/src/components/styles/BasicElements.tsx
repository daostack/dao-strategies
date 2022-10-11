import {
  Button,
  Form,
  Text,
  TextInput,
  TextArea,
  Box,
  ButtonExtendedProps,
  Select,
  BoxExtendedProps,
  Layer,
  Heading,
  TextAreaProps,
  ImageExtendedProps,
  Image,
  DateInputExtendedProps,
  DateInput,
  HeadingExtendedProps,
  FormFieldExtendedProps,
  FormField,
  SelectExtendedProps,
  DropButton,
  DropButtonExtendedProps,
  LayerExtendedProps,
  Accordion,
  AccordionPanel,
  AccordionPanelExtendedProps,
  AccordionExtendedProps,
} from 'grommet';
import { CircleQuestion, Clone, Close, FormDown, FormUp, IconProps, StatusGood, Validate } from 'grommet-icons';
import React, { CSSProperties, FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { GITHUB_DOMAINS } from '../../config/appConfig';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboad';
import { styleConstants } from './themes';

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
        backgroundColor: styleConstants.colors.lightGrayBackground,
        padding: '6.5px 16px',
        ...props.style,
      }}>
      {props.children}
    </Box>
  );
};

export const AppHeading: FC<HeadingExtendedProps> = (props: HeadingExtendedProps) => {
  return (
    <Heading {...props} weight="700" margin="none">
      {props.children}
    </Heading>
  );
};

export interface IValueElement extends IElement {
  value?: string;
}

type _type = 'slim' | 'normal' | 'large' | 'inline' | undefined;

export interface IButton extends ButtonExtendedProps {
  inline?: boolean;
  _type?: _type;
  gray?: boolean;
}

export const AppButton = (props: IButton) => {
  const style = ((_type: _type): React.CSSProperties => {
    switch (_type) {
      case 'slim':
        return { padding: '8px 16px', borderRadius: '50px' };
      case 'normal':
      case undefined:
        return { padding: '14px 28px', borderRadius: '50px' };
      default:
        return {};
    }
  })(props._type);

  const newProps = { ...props };

  if (props._type === 'inline') {
    return (
      <Box
        direction="row"
        onClick={props.onClick}
        style={{
          textDecoration: 'none',
          color: styleConstants.colors.links,
          fontSize: styleConstants.textFontSizes.xsmall,
          ...props.style,
        }}>
        {props.label}
      </Box>
    );
  }

  let textColor = newProps.secondary ? styleConstants.colors.primary : undefined;

  if (props.gray) {
    newProps.color = newProps.secondary
      ? styleConstants.colors.lessLightGrayBorder
      : styleConstants.colors.ligthGrayText;
    textColor = newProps.secondary ? styleConstants.colors.headingDark : '#ffffff';
  }

  return (
    <>
      <Button {...newProps} style={{ textAlign: 'center', color: textColor, ...style, ...props.style }} />
    </>
  );
};

export const AppForm = Form;

export interface IAppFormField extends FormFieldExtendedProps {
  help?: string | ReactNode;
}

export const AppFormField: FC<IAppFormField> = (props: IAppFormField) => {
  return <FormField {...props}>{props.children}</FormField>;
};

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

interface IAppTextArea extends TextAreaProps {
  autoResize?: boolean;
}

export const AppTextArea: FC<IAppTextArea> = (props: IAppTextArea) => {
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
    if (props.autoResize) {
      autosize();
    }
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
export interface IAppRemainingTime {
  compactFormat: boolean;
  remainingTime: Duration;
}
export const AppRemainingTime: FC<IAppRemainingTime> = (props: IAppRemainingTime) => {
  const { compactFormat, remainingTime } = props;

  const remainignTimeUI = (): JSX.Element => {
    if (compactFormat)
      return (
        <Box direction="row" gap="2px">
          <strong>{remainingTime.days}</strong> <span> days</span>
        </Box>
      );
    else
      return (
        <Box gap="10px" direction="row">
          <Box direction="row" gap="2px">
            <strong>{remainingTime.days}</strong> <span> days</span>
          </Box>
          <Box direction="row" gap="2px">
            <strong>{remainingTime.hours}</strong> <span> hours</span>
          </Box>
          <Box direction="row" gap="2px">
            <strong>{remainingTime.minutes}</strong> <span> minutes</span>
          </Box>
          <Box direction="row" gap="2px">
            <strong>{remainingTime.seconds}</strong> <span> seconds</span>
          </Box>
        </Box>
      );
  };

  return remainignTimeUI();
};

export const AppSelect: FC<SelectExtendedProps> = (props: SelectExtendedProps) => {
  return (
    <Select
      {...props}
      dropProps={{ style: { borderRadius: '24px', padding: '10px 0px', marginTop: '8px' } } as any}
      style={{
        borderColor: styleConstants.colors.lightGrayBorder,
        fontWeight: 'normal',
        padding: '8px 16px',
        borderRadius: '24px',
      }}></Select>
  );
};

export const SelectRow: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box direction="row" align="center" style={{ width: '100%', padding: '6px 12px', ...props.style }}>
      {props.children}
    </Box>
  );
};

export const SelectValue: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <SelectRow
      style={{
        border: '1px solid',
        borderRadius: '32px',
        borderColor: styleConstants.colors.lightGrayBorder,
        ...props.style,
      }}>
      {props.children}
    </SelectRow>
  );
};

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

export interface IAppCallout extends BoxExtendedProps {
  _type?: 'normal' | 'success';
  noIcon?: boolean;
}

export const AppCallout: FC<IAppCallout> = (props: IAppCallout) => {
  const type = props._type ? props._type : 'normal';
  const showIcon = props.noIcon !== undefined ? !props.noIcon : true;

  const color = type === 'normal' ? styleConstants.colors.lightGrayBackground : styleConstants.colors.primaryLight;
  return (
    <Box
      direction="row"
      align="center"
      style={{
        backgroundColor: color,
        fontSize: styleConstants.textFontSizes.small,
        borderRadius: '8px',
        padding: '14.5px 28px 14.5px 14.5px',
        ...props.style,
      }}>
      {showIcon ? (
        <Box style={{ marginRight: '20px' }}>
          {type === 'normal' ? <CircleQuestion></CircleQuestion> : <Validate></Validate>}
        </Box>
      ) : (
        <></>
      )}

      {props.children}
    </Box>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: styleConstants.colors.cardBackground,
  border: 'solid 1px',
  borderColor: styleConstants.colors.lightGrayBorder,
  padding: '16px 24px',
  borderRadius: '8px',
};

interface AppCardProps extends BoxExtendedProps {}

export const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>((props, ref) => {
  return (
    <Box
      {...props}
      ref={ref}
      style={{
        ...cardStyle,
        ...props.style,
      }}>
      {props.children}
    </Box>
  );
});

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
            justifyContent: 'center',
            alignItems: 'end',
            fontWeight: '700',
            padding: '0px 0px 0px 0px',
            position: 'absolute',
            width: '100%',
            left: '0',
            bottom: '0',
            height: '60px',
            cursor: 'pointer',
            background: `${
              expanded
                ? 'none'
                : 'linear-gradient(to bottom, rgb(255, 255, 255, 0), rgb(255, 255, 255, 1), rgb(255, 255, 255, 1))'
            }`,
          }}>
          <AppButton inline>{expanded ? 'Show-less' : 'Show-more'}</AppButton>
        </div>
      ) : (
        <></>
      )}
    </Box>
  );
};

export const HelpDrop: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return <Box style={{ padding: '21px 16px', fontSize: '12px' }}>{props.children}</Box>;
};

interface IHelpTip extends BoxExtendedProps {
  content: ReactNode;
  iconSize?: string;
}

export const HelpTip: FC<IHelpTip> = (props: IHelpTip) => {
  const { content } = props;

  const size = props.iconSize || '13.33px';
  const reg = new RegExp('(\\d+\\s?)(\\w+)');
  const parts = reg.exec(size);

  if (parts === null) {
    throw new Error(`size wrong`);
  }

  const value = +parts[1];
  const units = parts[2];

  return (
    <>
      <DropButton
        style={{ ...props.style }}
        dropContent={<HelpDrop>{content}</HelpDrop>}
        dropProps={
          { margin: '10px', align: { bottom: 'top' }, style: { borderRadius: '20px', maxWidth: '280px' } } as any
        }>
        <Box justify="center" style={{ overflow: 'hidden' }}>
          <CircleQuestion style={{ height: `${value}${units}`, width: `${value}${units}` }}></CircleQuestion>
        </Box>
      </DropButton>
    </>
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
    width: '27px',
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
  const [showGradient, setShowGradient] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);
  const paragraph = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (container !== null && paragraph !== null && container.current !== null && paragraph.current !== null) {
      if (container.current.clientHeight < paragraph.current.scrollHeight) {
        setShowGradient(true);
      }
    }
  }, [container, paragraph]);
  return (
    <Box ref={container} style={{ height: '50px', overflow: 'hidden', position: 'relative', ...props.style }}>
      <Box ref={paragraph}>{props.content}</Box>
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

interface INumberedRow extends BoxExtendedProps {
  number: number;
  text: React.ReactNode;
  disabled?: boolean;
  hideLine?: boolean;
}

export const NumberedRow: FC<INumberedRow> = (props: INumberedRow) => {
  return (
    <Box direction="row" style={{ ...props.style }}>
      <Box style={{ width: '28px', marginRight: '24px' }}>
        <Box
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: props.disabled
              ? styleConstants.colors.primaryLight
              : styleConstants.colors.buttonLightBorder,
            color: props.disabled ? '#6D6D6D' : styleConstants.colors.primary,
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
                width: '1px',
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

export const AppLabel: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box
      style={{
        textTransform: 'uppercase',
        fontSize: '14px',
        color: styleConstants.colors.ligthGrayText,
        fontWeight: '700',
        ...props.style,
      }}>
      {props.children}
    </Box>
  );
};

export interface IInfoProperty extends BoxExtendedProps {
  title: string;
}

export const InfoProperty: FC<IInfoProperty> = (props: IInfoProperty) => {
  return (
    <Box style={{ ...props.style }}>
      <AppLabel style={{ marginBottom: '12px' }}>{props.title}</AppLabel>
      <Box>{props.children}</Box>
    </Box>
  );
};

export interface IAppModal extends LayerExtendedProps {
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
    <Layer {...props} style={{ ...props.style }} position="right" onEsc={() => close()} onClickOutside={() => close()}>
      <Box style={{ paddingTop: '5vh', height: '100vh', width: '550px', flexShrink: '0' }}>
        <Box style={{ padding: '0 2.5vw', flexShrink: '0' }}>
          <Box
            direction="row"
            style={{ marginBottom: '20px', padding: '4px 0px' }}
            onClick={() => close()}
            align="center">
            <Close style={{ height: '12px', width: '12px' }}></Close>
          </Box>
          <AppHeading level="2">{props.heading}</AppHeading>
        </Box>
        <div style={{ overflowY: 'auto', padding: '0 2.5vw' }}>{child}</div>
      </Box>
    </Layer>
  );
};

export interface ICampaignIcon extends ImageExtendedProps {
  iconSize?: string;
}

export const CampaignIcon: FC<ICampaignIcon> = (props: ICampaignIcon) => {
  const size = props.iconSize || '120px';
  const reg = new RegExp('(\\d+\\s?)(\\w+)');
  const parts = reg.exec(size);

  if (parts === null) {
    throw new Error(`size wrong`);
  }

  const value = +parts[1];
  const units = parts[2];

  return (
    <Box
      style={{
        height: `${value}${units}`,
        width: `${value}${units}`,
        borderRadius: `${value / 2}${units}`,
        overflow: 'hidden',
        border: '1px solid',
        ...props.style,
      }}>
      <Image fit="cover" src={props.src || '/images/welcome-bg-1.png'}></Image>
    </Box>
  );
};

export const AppDateInput: FC<DateInputExtendedProps> = (props: DateInputExtendedProps) => {
  return (
    <DateInput
      calendarProps={{ daysOfWeek: true, size: 'small', style: { margin: '0 auto' } }}
      inputProps={{ style: { fontWeight: 'normal' } }}
      format="mm/dd/yyyy"
      {...props}></DateInput>
  );
};

export interface ICircleIcon extends BoxExtendedProps {
  icon: ReactElement;
  size?: number;
}

export const CircleIcon: FC<ICircleIcon> = (props: ICircleIcon) => {
  const size = props.size || 40;
  const icon = React.cloneElement(props.icon, {
    color: props.color || styleConstants.colors.primary,
    size: `${size * 0.5}px`,
  });
  return (
    <Box
      justify="center"
      align="center"
      style={{
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size / 2}px`,
        backgroundColor: styleConstants.colors.primaryLight,
        overflow: 'hidden',
        ...props.style,
      }}>
      {icon}
    </Box>
  );
};

export interface IRepoTag extends BoxExtendedProps {
  repo: string;
}

export const RepoTag: FC<IRepoTag> = (props: IRepoTag) => {
  return (
    <AppTag style={{ ...props.style }}>
      <a style={{ textDecoration: 'none' }} target="_blank" href={`${GITHUB_DOMAINS[0]}${props.repo}`} rel="noreferrer">
        {props.repo}
      </a>
    </AppTag>
  );
};

export const AppTip: FC<DropButtonExtendedProps> = (props: DropButtonExtendedProps) => {
  const [hovering, setHovering] = useState<boolean>(false);
  const [hoveringDrop, setHoveringDrop] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const timeout = 200;

  useEffect(() => {
    // console.log(`useEffect`, { hovering, hoveringDrop });

    if (hovering || hoveringDrop) {
      if (timer) {
        // console.log(`clearTimeout`, clearTimeout);
        clearTimeout(timer);
      }

      setOpen(true);
    }

    if (!hovering && !hoveringDrop) {
      if (timer) {
        // console.log(`clearTimeout`, clearTimeout);
        clearTimeout(timer);
      }

      const t = setTimeout(() => {
        setOpen(false);
        clearTimeout(timer);
      }, timeout);

      setTimer(t);
    }
  }, [hovering, hoveringDrop]);

  return (
    <DropButton
      {...props}
      open={open}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      dropContent={
        <Box onMouseEnter={() => setHoveringDrop(true)} onMouseLeave={() => setHoveringDrop(false)}>
          {props.dropContent}
        </Box>
      }
      style={{ marginLeft: '9px' }}
      dropProps={
        {
          margin: '10px',
          align: { bottom: 'top' },
          style: { borderRadius: '20px', maxWidth: '280px' },
          ...props.dropProps,
        } as any
      }>
      {props.children}
    </DropButton>
  );
};

/** forward an active property to know if panel is expanded (active is Context in grommet and we don't have
 * access to it here.) */
export const AppAccordion: FC<AccordionExtendedProps> = (props: AccordionExtendedProps) => {
  const [activeIx, setActiveIx] = useState<number>();

  if (props.children === null || props.children === undefined) {
    return <></>;
  }

  const children = props.children as ReactElement[];

  return (
    <Accordion
      {...props}
      onActive={(_ix) => {
        if (_ix && _ix.length > 0) {
          setActiveIx(_ix[0]);
        } else {
          setActiveIx(undefined);
        }
      }}>
      {children.map((child, ix) => {
        return React.cloneElement(child, { active: activeIx !== undefined && activeIx === ix });
      })}
    </Accordion>
  );
};

export interface IAppAccordionPanel extends AccordionPanelExtendedProps {
  active?: boolean;
  subtitle: string;
}

export const AppAccordionPanel: FC<IAppAccordionPanel> = (props: IAppAccordionPanel) => {
  const headingBasicStyle: CSSProperties = {
    color: styleConstants.colors.headingDark,
    padding: '12px 6px',
  };

  const headingStyle: CSSProperties = props.active
    ? {
        ...headingBasicStyle,

        borderTop: '1px solid',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderTopColor: styleConstants.colors.lightGrayBorder2,
        borderLeftColor: styleConstants.colors.lightGrayBorder2,
        borderRightColor: styleConstants.colors.lightGrayBorder2,
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }
    : {
        ...headingBasicStyle,

        border: '1px solid',
        borderColor: styleConstants.colors.lightGrayBorder2,
        borderRadius: '8px',
      };

  const dropBasicStyle: CSSProperties = {
    color: styleConstants.colors.headingDark,
    padding: '0px 12px 12px 12px', // Accordion panel has a hardcoded padding of 6px on the title
  };

  const dropStyle: CSSProperties = props.active
    ? {
        ...dropBasicStyle,
        borderBottom: '1px solid',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderBottomColor: styleConstants.colors.lightGrayBorder2,
        borderLeftColor: styleConstants.colors.lightGrayBorder2,
        borderRightColor: styleConstants.colors.lightGrayBorder2,
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      }
    : {
        ...headingBasicStyle,
        border: '1px solid',
        borderColor: styleConstants.colors.lightGrayBorder2,
        borderRadius: '8px',
      };

  return (
    <AccordionPanel
      {...props}
      style={{
        ...headingStyle,
        ...props.style,
      }}>
      <Box
        style={{
          ...dropStyle,
        }}>
        <Box
          style={{
            fontSize: styleConstants.textFontSizes.small,
            fontWeight: '500',
            color: styleConstants.colors.ligthGrayText2,
          }}>
          {props.subtitle}
        </Box>
        <HorizontalLine style={{ margin: '16px 0px' }}></HorizontalLine>
        {props.children}
      </Box>
    </AccordionPanel>
  );
};

export interface IBytesInfo extends BoxExtendedProps {
  label: ReactNode;
  sublabel?: ReactNode;
  help?: ReactNode;
  bytes: ReactNode;
  bytesText?: string;
}

export const BytesInfo: FC<IBytesInfo> = (props: IBytesInfo) => {
  const { copied, copy } = useCopyToClipboard();

  let bytesText: string;
  if (typeof props.bytes !== 'string') {
    if (props.bytesText === undefined) {
      console.warn(`bytesText must be provided if the bytes props is not a simple string`);
      return <></>;
    }

    bytesText = props.bytesText;
  } else {
    bytesText = props.bytes;
  }

  return (
    <Box direction="row" justify="between" align="start" style={{ ...props.style }}>
      <Box style={{ flexShrink: '0', marginRight: '12px' }}>
        <Box direction="row" align="center">
          <AppLabel style={{ fontSize: styleConstants.textFontSizes.xsmall, marginRight: '10.5px' }}>
            {props.label}
          </AppLabel>
          {props.help ? <HelpTip iconSize="15px" content={props.help} /> : <></>}
        </Box>
        {props.sublabel ? (
          <Box
            style={{
              fontSize: styleConstants.textFontSizes.xsmall,
              fontWeight: '500',
              color: styleConstants.colors.ligthGrayText2,
            }}>
            {props.sublabel}
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box
        direction="row"
        align="center"
        style={{
          maxWidth: '244px',
        }}>
        <Box
          style={{
            wordWrap: 'break-word',
            textAlign: 'right',
            fontSize: styleConstants.textFontSizes.small,
            fontWeight: '500',
          }}>
          {props.bytes}
        </Box>
        <Box style={{ padding: '0px 16px' }} onClick={() => copy(bytesText)}>
          {copied ? (
            <StatusGood color={styleConstants.colors.links}> </StatusGood>
          ) : (
            <Clone color={styleConstants.colors.links}></Clone>
          )}
        </Box>
      </Box>
    </Box>
  );
};
