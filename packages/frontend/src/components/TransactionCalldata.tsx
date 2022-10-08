import { campaignProvider } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { FC } from 'react';
import { useProvider } from 'wagmi';
import { BytesInfo } from './styles/BasicElements';

export interface ITransactionCalldata extends BoxExtendedProps {
  address: string;
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

  return (
    <Box>
      <BytesInfo
        label="Contract address"
        help="This is the campaign\'s address"
        bytes={address}
        style={{ marginBottom: '24px' }}></BytesInfo>
      <BytesInfo
        label={'Call-data'}
        sublabel={`method: "${props.method}(${concatEls(props.params)})"`}
        help="This call-data will call the lock method on the contract with the lock parameter set as true"
        bytes={calldata}></BytesInfo>
    </Box>
  );
};
