import { dark, grommet, ThemeType } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

export const styleConstants = {
  headingFontSizes: ['28px', '24px', '20px'],
  textFontSizes: ['16px', '14px'],
  colors: {
    ligthGrayText: '#989BA0',
    lightGrayBorder: '#F0EDED',
  },
};

export const theme = {
  primary: '#4BA664',
  primaryLight: 'rgba(75, 166, 99, 0.05)',
  links: '#5762D5',
  buttonLight: 'rgb(75, 166, 100, 0.05)',
  buttonLightBorder: 'rgb(75, 166, 100, 0.2)',
};

const extension: ThemeType = {
  global: {
    colors: {
      brand: theme.primary,
      brandLight: theme.primaryLight,
      background: '#F3F2EF',
    },
    font: {
      size: styleConstants.textFontSizes[0],
    },
    input: {
      font: {
        size: '14px',
      },
    },
  },
  button: {
    border: { radius: '24px' },
    primary: { color: theme.primary },
    extend: (props) => {
      return props.primary
        ? css`
            * {
              color: white;
            }
          `
        : ``;
    },
  },
  formField: {
    checkBox: {
      pad: 'small',
    },
    label: {
      weight: 700,
      size: '14px',
      margin: '0px 0px 8px 0px',
    },
    border: false,
  },
  fileInput: {
    message: {
      size: '14px',
    },
  },
  select: {
    control: {
      extend: css`
        & {
          border-style: none;
        }
      `,
    },
  },
  textArea: {
    extend: (props) => {
      return css`
        * {
          padding: 14px 36px;
          border-width: 1px;
          border-style: solid;
          border-color: #8b7d7d;
          border-radius: 24px;
        }
      `;
    },
  },
  textInput: {
    container: {
      extend: (props) => {
        return css`
          * {
            padding: 14px 36px;
            border-width: 1px;
            border-style: solid;
            border-color: #8b7d7d;
            border-radius: 24px;
          }
        `;
      },
    },
  },
  checkBox: {
    color: theme.primary,
  },
  table: {
    header: {
      extend: css`
        border: none;
      `,
    },
  },
  tip: {
    content: {
      background: '#FFFFFF',
    },
  },
};

export const lightTheme = deepMerge(grommet, extension);
export const darkTheme = deepMerge(dark, extension);
