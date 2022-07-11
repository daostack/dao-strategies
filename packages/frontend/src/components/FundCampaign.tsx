import { ChainsDetails, ContractsJson } from '@dao-strategies/core';
import { Contract, ethers } from 'ethers';
import { Select, Box, Header, FormField, TextInput } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { AssetIcon } from './Assets';
import { AppForm, AppButton, IElement } from './styles/BasicElements';

interface FundFormValues {
  asset: string;
  amount: string;
}

const initialValues: FundFormValues = {
  asset: '',
  amount: '',
};

interface IFundCampaign extends IElement {
  asset: string;
  chainId: number;
  address: string;
  onSuccess?: () => void;
}

export const FundCampaign: FC<IFundCampaign> = (props: IFundCampaign) => {
  const [formValues, setFormValues] = useState<FundFormValues>(initialValues);
  const { account, connect } = useLoggedUser();
  const isLogged = account !== undefined;

  const { data: signer } = useSigner();

  useEffect(() => {
    setFormValues({
      ...formValues,
      asset: props.asset,
    });
  }, [props]);

  const onValuesUpdated = (values: FundFormValues) => {
    /** asset is index when selected */
    const asset = Number.isInteger(parseFloat(values.asset)) ? assets[+values.asset as number].id : values.asset;

    setFormValues({ ...values, asset });
  };

  const assets = ChainsDetails.chainAssets(props.chainId);
  const selectedAsset = assets.find((asset) => asset.id === formValues.asset);

  const fund = async () => {
    if (!isLogged) {
      connect();
      return;
    }

    if (selectedAsset === undefined) throw new Error('selected asset undefined');

    if (signer == null) throw new Error('Signer null');

    let tx;
    if (ChainsDetails.isNative(selectedAsset)) {
      tx = await signer.sendTransaction({
        value: ethers.utils.parseEther(formValues.amount),
        to: props.address,
      });
    } else {
      const token = new Contract(selectedAsset.address, ContractsJson.jsonOfChain().contracts.TestErc20.abi, signer);
      tx = await token.transfer(props.address, ethers.utils.parseEther(formValues.amount));
    }
    await tx.wait();
    if (props.onSuccess !== undefined) props.onSuccess();
  };

  return (
    <>
      <Box style={{ width: '600px' }} pad="large" direction="column" align="center">
        <AppForm value={formValues} onChange={onValuesUpdated as any}>
          <Header>Fund Campaign</Header>
          <Box>
            <FormField name="asset" label="Asset" style={{ border: '0px none' }}>
              <Select
                name="asset"
                style={{ border: '0px none' }}
                options={Object.keys(assets)}
                value={
                  <Box pad="small">
                    <AssetIcon asset={selectedAsset !== undefined ? selectedAsset : undefined}></AssetIcon>
                  </Box>
                }>
                {(key) => {
                  return <AssetIcon asset={assets[key]}></AssetIcon>;
                }}
              </Select>
            </FormField>
            <FormField name="amount" label="Amount">
              <TextInput name="amount" placeholder="0"></TextInput>
            </FormField>
            <AppButton primary onClick={() => fund()}>
              {isLogged ? 'Fund' : 'Connect & Fund'}
            </AppButton>
          </Box>
        </AppForm>
      </Box>
    </>
  );
};
