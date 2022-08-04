import { dark, grommet, ThemeType } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

export const styleConstants = {
  fontSize: '18px',
};

export const theme = {
  primary: '#4BA664',
  primaryLight: 'rgba(75, 166, 99, 0.05)',
};

const extension: ThemeType = {
  global: {
    colors: {
      brand: theme.primary,
      'light-1': theme.primaryLight,
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
    label: {
      weight: 700,
    },
    border: false,
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
};

export const lightTheme = deepMerge(grommet, extension);
export const darkTheme = deepMerge(dark, extension);
