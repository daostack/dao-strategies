import { campaignInstance, campaignProvider, ChainsDetails, cmpAddresses } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import { Box, BoxExtendedProps } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC, useState } from 'react';
import { chain, useAccount, useProvider, useSigner } from 'wagmi';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { AppButton, BytesInfo } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface ITransactionCalldata extends BoxExtendedProps {
  address: string;
  chainId: number;
  method: 'setLock' | 'challenge';
  params: (string | boolean | number | BigNumber)[];
  value: string;
  approvedAccount?: string; // if defined, the transaction can be sent with the current signer
}

export const TransactionCalldata: FC<ITransactionCalldata> = (props: ITransactionCalldata) => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { account } = useLoggedUser();

  const [signing, setSigning] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const address = props.address;
  const instance = campaignProvider(address, provider);
  const calldata = (instance.interface.encodeFunctionData as any)(props.method, props.params);

  const concatEls = (array: (string | boolean | number | BigNumber)[]) => {
    return array.reduce((acc: string, el) => acc.concat(el.toString()), '');
  };

  const chain = ChainsDetails.chainOfId(props.chainId);
  const url = chain && chain.exploreAddress ? chain.exploreAddress(address) : undefined;

  /** send transaction */
  const canSend =
    account && signer && props.approvedAccount !== undefined && cmpAddresses(props.approvedAccount, account);

  const sendTx = async () => {
    if (canSend && !success) {
      const instanceWrite = campaignInstance(address, signer);
      const anyMethod = instanceWrite[props.method] as any;

      setSigning(true);
      try {
        const tx = await anyMethod(...props.params);
        setSigning(false);
        setPending(true);
        try {
          await tx.wait();
          setPending(false);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } catch (e) {
          setPending(false);
        }
      } catch (e) {
        setSigning(false);
      }
    }
  };

  const btnText = (() => {
    if (signing) {
      return 'Waiting for approval...';
    }
    if (pending) {
      return 'Waiting for tx...';
    }

    return 'Call Method';
  })();

  const disabled = signing || pending;

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

      {canSend ? (
        <Box direction="row" justify="end">
          {!success ? (
            <AppButton
              _type="slim"
              primary
              style={{ width: 'fit-content', margin: '18px 32px 12px 0px' }}
              label={btnText}
              disabled={disabled}
              onClick={() => sendTx()}
            />
          ) : (
            <Box
              style={{ padding: '8px 16px', margin: '18px 32px 12px 0px', color: styleConstants.colors.primary }}
              direction="row"
              align="center">
              Method called successfully
              <Box style={{ padding: '0px 6px' }}>
                <StatusGood color={styleConstants.colors.primary}></StatusGood>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
