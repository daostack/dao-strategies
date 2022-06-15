import { grommet, ThemeType } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';

export const styleConstants = {
  fontSize: '18px',
};

const primary = '#4BA664';

const extension: ThemeType = {
  button: {
    border: { radius: '24px' },
    primary: { color: primary },
    extend: (props) => {
      return props.primary ? `color: white;` : ``;
    },
  },
};

export const theme = deepMerge(grommet, extension);
