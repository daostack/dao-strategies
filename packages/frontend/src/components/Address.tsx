import { ChainsDetails, getAddress } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { CSSProperties, FC } from 'react';
import { styleConstants } from './styles/themes';

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

  const address = getAddress(props.address);
  const addressStr = address ? `${address.slice(0, 5)}...${address.slice(address.length - 5, address.length)}` : '';

  const style: CSSProperties = { color: styleConstants.colors.links, textDecoration: 'none', ...props.style };

  return (
    <Box {...props}>
      {exploreAddress ? (
        <Box align="center" direction="row">
          {disableClick ? (
            <Box style={style}>{addressStr}</Box>
          ) : (
            <a style={style} target="_blank" rel="noreferrer" href={exploreAddress(props.address)}>
              {addressStr}
            </a>
          )}
        </Box>
      ) : (
        <span style={{ color: styleConstants.colors.links }}>{addressStr}</span>
      )}
    </Box>
  );
};
