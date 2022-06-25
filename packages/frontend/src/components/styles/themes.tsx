import { grommet, ThemeType } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

export const styleConstants = {
  fontSize: '18px',
};

const primary = '#4BA664';

const extension: ThemeType = {
  button: {
    border: { radius: '24px' },
    primary: { color: primary },
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
};

export const theme = deepMerge(grommet, extension);
