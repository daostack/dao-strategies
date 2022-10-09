import { ChainsDetails, getAddress } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { CSSProperties, FC } from 'react';
import { useEnsName } from 'wagmi';
import { styleConstants } from './styles/themes';

interface IAddress extends BoxExtendedProps {
  address: string | undefined;
  chainId: number | undefined;
  disableClick?: boolean;
}

export const Address: FC<IAddress> = (props: IAddress) => {
  const { data: ens } = useEnsName({
    address: props.address,
    enabled: false,
  });

  if (props.address === null || props.address === undefined || props.chainId === null || props.chainId === undefined) {
    return <></>;
  }

  const disableClick = props.disableClick !== undefined ? props.disableClick : false;

  const chain = ChainsDetails.chainOfId(props.chainId);
  const exploreAddress = chain?.exploreAddress;
  const exploreEns = chain?.exploreEns;

  const address = getAddress(props.address);
  const text = ens
    ? ens
    : address
    ? `${address.slice(0, 5)}...${address.slice(address.length - 5, address.length)}`
    : '';

  const url = ens
    ? exploreEns !== undefined
      ? exploreEns(ens)
      : undefined
    : exploreAddress !== undefined
    ? exploreAddress(props.address)
    : undefined;

  const style: CSSProperties = { color: styleConstants.colors.links, textDecoration: 'none', ...props.style };

  return (
    <Box {...props}>
      {exploreAddress ? (
        <Box align="center" direction="row">
          {disableClick ? (
            <Box style={style}>{text}</Box>
          ) : url !== undefined ? (
            <a style={style} target="_blank" rel="noreferrer" href={url}>
              {text}
            </a>
          ) : (
            text
          )}
        </Box>
      ) : (
        <span style={{ color: styleConstants.colors.links }}>{text}</span>
      )}
    </Box>
  );
};
