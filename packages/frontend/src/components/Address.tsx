import { ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { Link } from 'grommet-icons';
import { FC } from 'react';
import { theme } from './styles/themes';

interface IAddress extends BoxExtendedProps {
  address: string | null | undefined;
  chainId: number | null | undefined;
}

export const Address: FC<IAddress> = (props: IAddress) => {
  if (props.address === null || props.address === undefined || props.chainId === null || props.chainId === undefined) {
    return <></>;
  }

  const exploreAddress = ChainsDetails.chainOfId(props.chainId).exploreAddress;
  const length = props.address.length;
  const addressStr = `${props.address.toLowerCase().slice(0, 5)}...${props.address
    .toLowerCase()
    .slice(length - 5, length)}`;

  return (
    <Box {...props}>
      {exploreAddress ? (
        <Box align="center" direction="row">
          <a
            style={{ color: theme.links, textDecoration: 'none' }}
            target="_blank"
            rel="noreferrer"
            href={exploreAddress(props.address)}>
            {addressStr} <Link color={theme.links} style={{ height: '14px' }}></Link>
          </a>
        </Box>
      ) : (
        <span style={{ color: theme.links }}>{addressStr}</span>
      )}
    </Box>
  );
};
