import { Box, ResponsiveContext } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { styleConstants } from '../styles/themes';
import { ByDAOstack } from './ByDAOstack';
import { Logo } from '../Logo';

import { AppHeading, IElement } from '../styles/BasicElements';

export const Footer: FC<IElement> = () => {
  const size = React.useContext(ResponsiveContext);

  const boxStyle = ((size: string): React.CSSProperties => {
    switch (size) {
      case 'xsmall':
      case 'small':
        return {
          width: '100%',
        };

      case 'medium':
      case 'large':
        return {
          width: '50%',
        };
      default:
        return {
          width: '25%',
        };
    }
  })(size);

  const footerBoxStyle = ((size: string): any => {
    switch (size) {
      case 'xsmall':
        return {
          width: '100%',
          direction: 'column',
        };

      case 'small':
        return {
          width: '100%',
          direction: 'column',
        };
      case 'medium':
      case 'large':
        return {
          width: '50%',
          direction: 'row',
        };
      default:
        return {
          width: '25%',
        };
    }
  })(size);

  return (
    <>
      <Box
        direction={footerBoxStyle.direction}
        style={{
          paddingLeft: '8vw',
          paddingRight: '8vw',
          paddingTop: '2vw',
        }}>
        {/* Logo */}
        <Box style={{ width: '35%' }}>
          <Logo style={footerBoxStyle}></Logo>
        </Box>

        {/* Follow us and Resources */}
        <Box style={{ width: '65%' }} align="start" justify="start" direction={footerBoxStyle.direction}>
          {/* Follow us box */}
          <Box pad={{ vertical: 'medium' }}>
            <AppHeading size="28px">Follow Us</AppHeading>
            <Box pad={{ vertical: 'medium' }} gap="18px">
              <p>Twitter</p>
              <p>Twitter</p>
              <p>Twitter</p>
            </Box>
          </Box>
          {/* Resources box */}
          <Box pad={{ vertical: 'medium' }} margin={{ left: footerBoxStyle.direction === 'row' ? '130px' : '0px' }}>
            <AppHeading size="28px">Resources</AppHeading>
            <Box pad={{ vertical: 'medium' }} gap="18px">
              <p>Docs</p>
              <p>Blog</p>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
