import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';

export const ByDAOstack: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  return (
    <Box style={{ ...props.style }} direction="row" justify="center">
      <Box>by</Box>
      <Box style={{ margin: '0 8px' }}>
        <img style={{ width: '20px' }} src="/images/daostack-03.svg" alt="logo daostack"></img>
      </Box>
      <Box>DAOstack</Box>
    </Box>
  );
};
