import { Asset, campaignInstance, ChainsDetails, erc20Instance } from '@dao-strategies/core';
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
  const [funding, setFunding] = useState<boolean>(false);

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
    const campaign = campaignInstance(props.address, signer);
    if (ChainsDetails.isNative(selectedAsset)) {
      tx = await campaign.fund(ethers.constants.AddressZero, 0, { value: ethers.utils.parseEther(formValues.amount) });
    } else {
      const token = erc20Instance(selectedAsset.address, signer);
      const approved = await token.allowance(account, props.address);

      const value = ethers.utils.parseUnits(formValues.amount, selectedAsset.decimals);

      if (approved.sub(value).lt(0)) {
        const tx = await token.approve(props.address, value.sub(approved));
        await tx.wait();
      }

      tx = await campaign.fund(selectedAsset.address, value);
    }

    setFunding(true);
    await tx.wait();
    setFunding(false);

    if (props.onSuccess !== undefined) props.onSuccess();
  };

  const disabled = funding || selectedAsset === undefined;

  return (
    <>
      <Box style={{ width: '100%' }} direction="column" align="start">
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

            <AppButton primary disabled={disabled} onClick={() => fund()} style={{ marginTop: '20px' }}>
              {isLogged ? 'Fund' : 'Connect & Fund'}
            </AppButton>
          </Box>
        </AppForm>

        {funding ? (
          <Box justify="center" align="center" style={{ marginTop: '30px', alignSelf: 'center' }}>
            Waiting for tx confirmation...
            <br></br>
            <br></br>
            <Spinner></Spinner>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};
