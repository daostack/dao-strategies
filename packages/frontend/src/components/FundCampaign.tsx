import { Asset, ChainsDetails, ContractsJson } from '@dao-strategies/core';
import { Contract, ethers } from 'ethers';
import { Select, Box, Header, FormField, TextInput, Spinner, Heading } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { AssetIcon } from './Assets';
import { AppForm, AppButton, IElement } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

interface FundFormValues {
  asset: string;
  amount: string;
}

const initialValues: FundFormValues = {
  asset: '0',
  amount: '',
};

interface IFundCampaign extends IElement {
  asset?: string;
  assets: Asset[];
  chainId: number;
  address: string;
  onSuccess?: () => void;
}

export const FundCampaign: FC<IFundCampaign> = (props: IFundCampaign) => {
  const [formValues, setFormValues] = useState<FundFormValues>(initialValues);
  const { account, connect } = useLoggedUser();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (props.assets.length > 0) {
      setFormValues({
        ...formValues,
        asset: props.assets[0].id,
      });
    }
  }, [props]);

  const isLogged = account !== undefined;
  const assets = props.assets;

  const onValuesUpdated = (values: FundFormValues) => {
    setFormValues({ ...values });
  };

  const selectedAsset = props.assets.find((asset) => asset.id === formValues.asset);

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
      <Box style={{ width: '100%' }} direction="column" align="start">
        <Heading style={{ fontSize: styleConstants.headingFontSizes[1] }}>Fund Campaign</Heading>

        <AppForm style={{ width: '100%' }} value={formValues} onChange={onValuesUpdated as any}>
          <Box>
            <Box style={{ position: 'relative' }}>
              <FormField name="amount" label="Enter amount to fund">
                <TextInput name="amount" placeholder="0"></TextInput>
              </FormField>
              <FormField name="asset" style={{ border: '0px none', position: 'absolute', right: '0px', top: '30px' }}>
                <Select
                  name="asset"
                  style={{ border: '0px none' }}
                  options={assets.map((asset) => asset.id)}
                  value={
                    <Box pad="small">
                      <AssetIcon asset={selectedAsset !== undefined ? selectedAsset : undefined}></AssetIcon>
                    </Box>
                  }>
                  {(key) => {
                    return <AssetIcon asset={assets.find((asset) => asset.id === key)}></AssetIcon>;
                  }}
                </Select>
              </FormField>
            </Box>

            <AppButton primary onClick={() => fund()} style={{ marginTop: '20px' }}>
              {isLogged ? 'Fund' : 'Connect & Fund'}
            </AppButton>
          </Box>
        </AppForm>
      </Box>
    </>
  );
};
