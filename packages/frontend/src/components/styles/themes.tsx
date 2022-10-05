import { dark, grommet, ThemeType } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

export const styleConstants = {
  headingFontSizes: {
    1: '28px',
    2: '24px',
    3: '20px',
    4: '18px',
  },
  textFontSizes: {
    large: '18px',
    normal: '16px',
    normalSmaller: '15px',
    small: '14px',
    xsmall: '12px',
  },
  font: {
    secondary: 'Raleway',
  },
  colors: {
    primary: '#4BA664',
    primaryLight: 'rgba(75, 166, 100, 0.1)',
    text: '#585858',
    buttonLight: '#4ba664c',
    buttonLightBorder: '#4ba66433',
    lightGrayBackground: '#0000000c',
    ligthGrayText: '#989BA0',
    lightGrayTextDarker: '#575757',
    lightGrayBorder: '#F0EDED',
    headingDark: '#0E0F19',
    lessLightGrayBorder: '#E0E0E0',
    alertText: '#EF3E36',
    cardBackground: '#FFFFFF',
    whiteElements: '#FFFFFF',
    highlightedLight: '#FBFDFC',
    links: '#5762D5',
  },
};

export const theme = {};

const extension: ThemeType = {
  global: {
    colors: {
      brand: styleConstants.colors.primary,
      brandLight: styleConstants.colors.primaryLight,
      background: '#F3F2EF',
      text: styleConstants.colors.text,
    },
    font: {
      size: styleConstants.textFontSizes.normal,
    },
    input: {
      font: {
        size: styleConstants.textFontSizes.small,
      },
    },
  },
  heading: {
    color: styleConstants.colors.headingDark,
    level: {
      1: {
        medium: {
          size: styleConstants.headingFontSizes[1],
        },
      },
      2: {
        medium: {
          size: styleConstants.headingFontSizes[2],
        },
      },
      3: {
        medium: {
          size: styleConstants.headingFontSizes[3],
        },
      },
    },
    responsiveBreakpoint: undefined,
  },
  /** watch out, button is used everywere as sub-element by Grommet. */
  button: {
    primary: {
      color: styleConstants.colors.primary,
      extend: css`
        & {
          color: white;
          font-weight: 500;
        }
      `,
    },
    secondary: {
      extend: css`
        & {
          font-weight: 500;
        }
      `,
    },
  },
  formField: {
    checkBox: {
      pad: 'small',
    },
    label: {
      weight: 700,
      size: styleConstants.textFontSizes.small,
      margin: '0px 0px 8px 0px',
    },
    border: false,
  },
  fileInput: {
    message: {
      size: styleConstants.textFontSizes.small,
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
    color: styleConstants.colors.primary,
  },
  table: {
    header: {
      extend: css`
        & {
          border: none;
        }
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
