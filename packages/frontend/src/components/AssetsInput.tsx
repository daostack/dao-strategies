import { Asset, ChainsDetails, TokenBalance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Box, FormField, Select } from 'grommet';
import React, { CSSProperties, FC, useEffect, useState } from 'react';
import { useBalanceOf } from '../hooks/useBalanceOf';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { valueToString } from '../utils/general';
import { AssetIcon } from './Assets';
import { AppForm, AppInput, AppButton } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

interface FundFormValues {
  asset: string;
  amount: string;
}

const initialValues: FundFormValues = {
  asset: '0',
  amount: '',
};

export interface SelectedInputDetails {
  asset: TokenBalance;
  status: 'ok' | 'not-enough-funds';
}

export interface IAssetsInput {
  defaultAsset?: Asset;
  assets: Asset[];
  chainId: number;
  onAssetSelected: (details: SelectedInputDetails) => void;
}

export const AssetsInput: FC<IAssetsInput> = (props: IAssetsInput) => {
  const { account } = useLoggedUser();

  const [formValues, setFormValues] = useState<FundFormValues>(initialValues);
  const selectedAsset = props.assets?.find((asset) => asset.id === formValues.asset);
  const assets = props.assets;

  const { balance } = useBalanceOf(selectedAsset?.address, props.chainId, account);

  useEffect(() => {
    if (props.assets.length > 0) {
      setFormValues({
        ...formValues,
        asset: props.assets[0].id,
      });
    }
  }, [props.assets]);

  useEffect(() => {
    if (props.defaultAsset) {
      setFormValues({
        ...formValues,
        asset: props.defaultAsset.id,
      });
    }
  }, [props.defaultAsset]);

  useEffect(() => {
    if (selectedAsset) {
      const isNative = ChainsDetails.isNative(selectedAsset);
      const amount = formValues.amount !== '' ? formValues.amount : '0';
      const value = isNative
        ? ethers.utils.parseEther(amount)
        : ethers.utils.parseUnits(amount, selectedAsset.decimals);

      const selectedBalance: TokenBalance = {
        ...selectedAsset,
        balance: value.toString(),
      };

      const notEnoughFunds = balance ? value.gt(balance.balance) : false;
      const status = notEnoughFunds ? 'not-enough-funds' : 'ok';

      props.onAssetSelected({ asset: selectedBalance, status });
    }
  }, [selectedAsset, formValues, account, balance]);

  const onValuesUpdated = (values: FundFormValues) => {
    setFormValues({ ...values });
  };

  const balanceNum = balance ? +ethers.utils.formatUnits(balance.balance, balance.decimals) : undefined;

  const balanceComp =
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

  const dropStyle: CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.8)',
    boxShadow: 'none',
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid',
    borderColor: styleConstants.colors.lightGrayBackground,
    marginTop: '-6px',
    width: '200px',
  };

  return (
    <AppForm style={{ width: '100%' }} value={formValues} onChange={(values) => onValuesUpdated(values)}>
      <Box>
        <Box style={{ position: 'relative' }}>
          <FormField
            name="amount"
            label={
              <Box direction="row" justify="between" style={{ fontWeight: '400' }}>
                <Box>Enter amount to fund</Box>
                {balanceComp}
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
          <FormField name="asset" style={{ border: '0px none', position: 'absolute', right: '0px', top: '31px' }}>
            <Select
              name="asset"
              options={assets.map((asset) => asset.id)}
              dropProps={{ style: dropStyle } as any}
              value={
                <Box pad="small" style={{ width: '170px' }}>
                  <AssetIcon asset={selectedAsset !== undefined ? selectedAsset : undefined}></AssetIcon>
                </Box>
              }>
              {(key) => {
                return (
                  <AssetIcon
                    style={{ marginBottom: '2px' }}
                    asset={assets.find((asset) => asset.id === key)}></AssetIcon>
                );
              }}
            </Select>
          </FormField>
        </Box>
      </Box>
    </AppForm>
  );
};
