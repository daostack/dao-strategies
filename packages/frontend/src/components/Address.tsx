import { ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { Link } from 'grommet-icons';
import { CSSProperties, FC } from 'react';
import { styleConstants, theme } from './styles/themes';

interface IAddress extends BoxExtendedProps {
  address: string | null | undefined;
  chainId: number | null | undefined;
  disableClick?: boolean;
}

export const Address: FC<IAddress> = (props: IAddress) => {
  if (props.address === null || props.address === undefined || props.chainId === null || props.chainId === undefined) {
    return <></>;
  }

  const disableClick = props.disableClick !== undefined ? props.disableClick : false;

  const exploreAddress = ChainsDetails.chainOfId(props.chainId)?.exploreAddress;

  const length = props.address.length;
  const addressStr = `${props.address.toLowerCase().slice(0, 5)}...${props.address
    .toLowerCase()
    .slice(length - 5, length)}`;

  const style: CSSProperties = { color: styleConstants.colors.links, textDecoration: 'none' };

  return (
    <Box {...props}>
      {exploreAddress ? (
        <Box align="center" direction="row">
          {disableClick ? (
            <Box style={style}>{addressStr}</Box>
          ) : (
            <a style={style} target="_blank" rel="noreferrer" href={exploreAddress(props.address)}>
              {addressStr} <Link color={styleConstants.colors.links} style={{ height: '14px' }}></Link>
            </a>
          )}
        </Box>
      ) : (
        <span style={{ color: styleConstants.colors.links }}>{addressStr}</span>
      )}
    </Box>
  );
};
