import { Box, BoxExtendedProps, Text } from 'grommet';
import { Asset, ChainAndAssets, ChainsDetails, TokenBalance } from '@dao-strategies/core';
import { AppHeading, AppTag, IElement } from './styles/BasicElements';
import { FC } from 'react';
import { assetValue, formatEther, truncate } from '../utils/ethers';
import { styleConstants } from './styles/themes';
import { ethers } from 'ethers';
import { valueToString } from '../utils/general';

export interface ChainTagI extends BoxExtendedProps {
  chain?: ChainAndAssets;
}

export const ChainTag: FC<ChainTagI> = (props: ChainTagI) => {
  if (!props.chain) return <></>;

  const chain = props.chain;
  return (
    <AppTag style={{ textTransform: 'uppercase', fontSize: '14px', ...props.style }}>
      <Box style={{ height: '20px', width: '20px', marginRight: '6px' }}>
        <img style={{ height: '20px', width: '20px' }} src={chain.chainIcon} alt={chain.chain.name} />
      </Box>
      <Box>{chain.chain.name}</Box>
    </AppTag>
  );
};

interface IAsset extends IElement {
  asset?: Asset;
}

export const AssetIcon: FC<IAsset> = (props: IAsset) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box
      direction="row"
      align="center"
      justify="center"
      style={{
        height: '40px',
        width: '96px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        border: 'solid 1px',
        borderColor: styleConstants.colors.lightGrayBorder,
      }}>
      <Box style={{ textAlign: 'center', height: '20px', width: '20px' }}>
        <img src={props.asset.icon} alt={props.asset.name} />
      </Box>
      <Box style={{ textAlign: 'center' }}>{props.asset.name}</Box>
    </Box>
  );
};

interface IBalance extends BoxExtendedProps {
  asset?: TokenBalance;
}

export const AssetBalance: FC<IBalance> = (props: IBalance) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box direction="row" style={{ width: '100%', ...props.style }} justify="between" align="center">
      <Box direction="row" align="center">
        <Box style={{ textAlign: 'center', height: '24px', width: '24px' }}>
          <img src={props.asset.icon} alt={props.asset.name} />
        </Box>
        <Box style={{ textAlign: 'center', marginLeft: '8px' }}>{formatEther(props.asset.balance)}</Box>
        <Box style={{ textAlign: 'center', marginLeft: '8px' }}>{props.asset.name}</Box>
      </Box>

      <Box>~{assetValue(props.asset, 2)} usd</Box>
    </Box>
  );
};

export interface IAssetsTable extends BoxExtendedProps {
  assets?: TokenBalance[];
  showSummary?: boolean;
}

export const AssetsTable: FC<IAssetsTable> = (props: IAssetsTable) => {
  const claimValue = props.assets ? truncate(ChainsDetails.valueOfAssets(props.assets).toString(), 2) : '0';
  const showSummary = props.showSummary !== undefined ? props.showSummary : false;
  return (
    <>
      <Box
        direction="row"
        justify="between"
        style={{
          textTransform: 'uppercase',
          fontSize: '14px',
          color: styleConstants.colors.ligthGrayText,
        }}>
        <Box>Your share</Box>
        <Box>Value (USD)</Box>
      </Box>
      <Box
        style={{
          marginTop: '16px',
          border: '1px solid',
          borderRadius: '8px',
          borderColor: styleConstants.colors.lightGrayBorder,
          padding: '25px 24px',
        }}>
        {props.assets ? (
          props.assets.map((asset) => {
            return asset.balance !== '0' ? (
              <AssetBalance style={{ marginBottom: '24px' }} asset={asset}></AssetBalance>
            ) : (
              <></>
            );
          })
        ) : (
          <></>
        )}

        {showSummary ? (
          <>
            <hr
              style={{
                width: '100%',
                margin: '24px 0px',
                border: 'none',
                borderTop: 'solid 1px',
                borderColor: styleConstants.colors.lightGrayBorder,
              }}></hr>

            <Box direction="row" justify="between">
              <Box>Total Claim</Box>
              <AppHeading level="2">~{claimValue}</AppHeading>
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

export interface IAssetsValue extends BoxExtendedProps {
  assets?: TokenBalance[];
  preferred?: string;
  ratio?: number;
  type?: 'card' | 'inline';
}

export const AssetsValue: FC<IAssetsValue> = (props: IAssetsValue) => {
  if (!props.assets) {
    return <Box style={{ ...props.style }}>--</Box>;
  }

  const ratio = props.ratio !== undefined ? props.ratio : 1.0;
  const type = props.type || 'card';

  /** the preferred asset will be shown alone and big if provided */
  const preferred =
    props.preferred !== undefined ? props.assets.find((asset) => asset.id === props.preferred) : undefined;
  /** remove the preferred asset from the list of assets */
  const assets = preferred ? props.assets.filter((asset) => asset.id !== preferred.id) : props.assets;

  const raisedWithPrice = assets.filter((token) => token.price !== undefined);
  const rewardUSD = raisedWithPrice
    .map((token) => {
      const raised = +ethers.utils.formatUnits(token.balance, token.decimals) * (token.price as number);
      return raised * ratio;
    })
    .reduce((total, reward) => total + reward, 0);

  const raisedCustom = assets.filter((token) => token.price === undefined);

  let hasCustom = false;

  const customStr = raisedCustom
    .map((token) => {
      const raised = +ethers.utils.formatUnits(token.balance, token.decimals);
      if (raised > 0) {
        hasCustom = true;
      }
      return `${valueToString(raised * ratio, 2)} ${token.name}`;
    })
    .reduce((total, reward) => total.concat(' ' + reward), '');

  const hasValue = rewardUSD > 0;

  const { preferredString, secondaryString } = (() => {
    const usdString = hasValue ? `$${valueToString(rewardUSD, 2)}` : '-';
    const tokensString = hasCustom ? ` ${hasValue ? '+ ' : ''}${customStr}` : '';

    let preferredString = usdString;
    let secondaryString = tokensString;

    if (preferred) {
      const value = +ethers.utils.formatUnits(preferred.balance, preferred.decimals);
      preferredString = `${valueToString(value, 2)} ${preferred.name}`;
      secondaryString = hasValue ? `+ ${usdString}` : '' + tokensString;
    }

    return { preferredString, secondaryString };
  })();

  /** If no preferred asset, then the USD value will be prioritized. */
  if (type === 'card') {
    return (
      <Box
        style={{
          borderBottom: '2px dashed',
          borderColor: styleConstants.colors.lightGrayBorder,
          paddingBottom: '4px',
          ...props.style,
        }}>
        <Box
          direction="row"
          justify="center"
          style={{
            fontSize: '32px',
            marginBottom: '6px',
          }}>
          {preferredString}
        </Box>
        <Box direction="row" justify="end">
          {secondaryString}
        </Box>
      </Box>
    );
  } else {
    return (
      <span>
        <b>{preferredString}</b>
        {secondaryString}
      </span>
    );
  }
};
