import { campaignProvider, ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { chain, useProvider } from 'wagmi';
import { BytesInfo } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface ITransactionCalldata extends BoxExtendedProps {
  address: string;
  chainId: number;
  method: 'setLock' | 'challenge';
  params: (string | boolean)[];
  value: string;
}

export const TransactionCalldata: FC<ITransactionCalldata> = (props: ITransactionCalldata) => {
  const provider = useProvider();
  const address = props.address;

  const instance = campaignProvider(address, provider);

  const calldata = (instance.interface.encodeFunctionData as any)(props.method, props.params);

  const concatEls = (array: (string | boolean)[]) => {
    return array.reduce((acc: string, el) => acc.concat(el.toString()), '');
  };

  const chain = ChainsDetails.chainOfId(props.chainId);
  const url = chain && chain.exploreAddress ? chain.exploreAddress(address) : undefined;

  return (
    <Box>
      <BytesInfo
        label="Contract address"
        help="This is the campaign\'s address"
        bytes={
          url ? (
            <a
              style={{ textDecoration: 'none', color: styleConstants.colors.links }}
              href={url}
              target="_blank"
              rel="noreferrer">
              {address}
            </a>
          ) : (
            <>{address}</>
          )
        }
        bytesText={address}
        style={{ marginBottom: '24px' }}></BytesInfo>
      <BytesInfo
        label={'Call-data'}
        sublabel={`method: "${props.method}(${concatEls(props.params)})"`}
        help={`This call-data will call the "${
          props.method
        }" method on the campaign contract with the following parameters: ${JSON.stringify(props.params)}`}
        bytes={calldata}></BytesInfo>
    </Box>
  );
};
