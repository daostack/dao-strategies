import { Asset, campaignInstance, ChainsDetails, erc20Instance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Select, Box, FormField, TextInput, Spinner } from 'grommet';
import { FC, useCallback, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { useBalanceOf } from '../hooks/useBalanceOf';
import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { valueToString } from '../utils/general';
import { AssetIcon } from './Assets';
import { AppForm, AppButton, IElement, AppInput } from './styles/BasicElements';
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
  defaultAsset?: Asset;
  onSuccess?: () => void;
}

export const FundCampaign: FC<IFundCampaign> = (props: IFundCampaign) => {
  const [formValues, setFormValues] = useState<FundFormValues>(initialValues);
  const [funding, setFunding] = useState<boolean>(false);
  const { account, connect } = useLoggedUser();
  const { recentFunders, getFundEvents } = useCampaignContext();

  const selectedAsset = props.assets.find((asset) => asset.id === formValues.asset);
  const isNative = selectedAsset ? ChainsDetails.isNative(selectedAsset) : false;

  const { balance } = useBalanceOf(selectedAsset?.address, props.chainId, account);

  const { data: signer } = useSigner();

  useEffect(() => {
    if (props.assets.length > 0) {
      setFormValues({
        ...formValues,
        asset: props.assets[0].id,
      });
    }
  }, [props.assets]);

  useEffect(() => {
    getFundEvents();
  }, []);

  useEffect(() => {
    if (props.defaultAsset) {
      setFormValues({
        ...formValues,
        asset: props.defaultAsset.id,
      });
    }
  }, [props.defaultAsset]);

  const isLogged = account !== undefined;
  const assets = props.assets;

  const onValuesUpdated = (values: FundFormValues) => {
    setFormValues({ ...values });
  };

  const fund = useCallback(async () => {
    if (!isLogged) {
      connect();
      return;
    }

    if (selectedAsset === undefined) throw new Error('selected asset undefined');
    if (signer == null) throw new Error('Signer null');

    let tx;
    const campaign = campaignInstance(props.address, signer);
    if (isNative) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, selectedAsset, signer, isNative, formValues.amount, account]);

  const balanceNum = balance ? +ethers.utils.formatUnits(balance.balance, balance.decimals) : undefined;
  const disabled = funding || selectedAsset === undefined || +formValues.amount === 0;
  const notEnoughFunds = balanceNum !== undefined ? balanceNum < +formValues.amount : false;

  const balanceStr =
    balance !== undefined && balanceNum !== undefined ? (
      <Box direction="row" align="center" style={{ color: styleConstants.colors.ligthGrayText }}>
        Balance:
        <Box style={{ marginLeft: '8px', textDecoration: 'underline' }}>{`${valueToString(balanceNum)} ${
          balance.name
        }`}</Box>
      </Box>
    ) : (
      '--'
    );

  return (
    <>
      <Box style={{ width: '100%', ...props.style }} direction="column" align="start">
        <AppForm style={{ width: '100%' }} value={formValues} onChange={onValuesUpdated as any}>
          <Box>
            <Box style={{ position: 'relative' }}>
              <FormField
                name="amount"
                label={
                  <Box direction="row" justify="between" style={{ fontWeight: '400' }}>
                    <Box>Enter amount to fund</Box>
                    {balanceStr}
                  </Box>
                }>
                <AppInput
                  style={{
                    padding: '0px 24px',
                    height: '72px',
                    fontSize: styleConstants.headingFontSizes[3],
                    fontWeight: '700',
                    color: styleConstants.colors.ligthGrayText,
                    borderRadius: '46px',
                  }}
                  type="number"
                  name="amount"
                  placeholder="0.0"></AppInput>
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

            <AppButton
              label={isLogged ? 'Fund Campaign' : 'Connect to fund'}
              primary
              disabled={disabled || notEnoughFunds}
              onClick={() => fund()}
              style={{ marginTop: '20px' }}
            />
            {notEnoughFunds ? (
              <Box
                direction="row"
                justify="end"
                style={{ paddingRight: '20px', marginTop: '8px', color: styleConstants.colors.alertText }}>
                not enough funds
              </Box>
            ) : (
              ''
            )}
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

        <Box>
          <Box>Recent funders</Box>
          {recentFunders ? (
            recentFunders.map((funder) => {
              return <Box>{funder.amount}</Box>;
            })
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
};
