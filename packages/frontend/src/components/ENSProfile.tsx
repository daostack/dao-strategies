import { Box, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { FieldLabel } from '../pages/create/field.label';
import { useAccount, useEnsName } from 'wagmi'


export interface ENSProfileI {
  text?: string
}

export const ENSProfile: FC<ENSProfileI> = (props: ENSProfileI) => {
  const { address, isConnected } = useAccount()
  const { data: ENSProfile, error, isLoading, refetch } = useEnsName({
    address: address,
    enabled: false,
  })
  const { text } = props;
  const returnENSOrAddress = (): JSX.Element => {
    if (ENSProfile) return (<>{ENSProfile}</>)
    else return (<>{`${(address as string).slice(0, 10)}...`}</>)
  }
  return (
    <>
      {isConnected ? (
        <>
          <Box direction='row' gap='4px' justify="end" align="end">
            {text && (<FieldLabel label={text}  ></FieldLabel>)}
            {isLoading ? <Spinner></Spinner> : returnENSOrAddress()}
          </Box>
        </>
      ) : ''}

    </>
  );
};
