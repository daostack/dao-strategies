import { Box, BoxExtendedProps, Text } from 'grommet';
import { Asset, ChainAndAssets, ChainsDetails, TokenBalance } from '@dao-strategies/core';
import { AppHeading, AppLabel, AppTag, AppTip, IElement } from './styles/BasicElements';
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

interface IAsset extends BoxExtendedProps {
  asset?: Asset;
}

export const AssetIcon: FC<IAsset> = (props: IAsset) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box
      direction="row"
      align="center"
      justify="start"
      style={{
        height: '40px',
        padding: '4px 12px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        border: 'solid 1px',
        borderColor: styleConstants.colors.lightGrayBorder,
        ...props.style,
      }}>
      <Box style={{ textAlign: 'center', height: '20px', width: '20px' }}>
        <img src={props.asset.icon} alt={props.asset.name} />
      </Box>
      <Box style={{ textAlign: 'center', marginLeft: '8px' }}>{props.asset.name}</Box>
    </Box>
  );
};

interface IBalance extends BoxExtendedProps {
  asset?: TokenBalance;
}

export const AssetBalance: FC<IBalance> = (props: IBalance) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box direction="row" align="center" style={{ fontWeight: '500' }}>
      <Box style={{ textAlign: 'center', height: '24px', width: '24px' }}>
        <img src={props.asset.icon} alt={props.asset.name} />
      </Box>
      <Box style={{ textAlign: 'center', marginLeft: '8px' }}>
        {ethers.utils.formatUnits(props.asset.balance, props.asset.decimals)}
      </Box>
      <Box style={{ textAlign: 'center', marginLeft: '8px' }}>{props.asset.name}</Box>
    </Box>
  );
};

export const AssetBalanceRow: FC<IBalance> = (props: IBalance) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box direction="row" style={{ width: '100%', ...props.style }} justify="between" align="center">
      <AssetBalance asset={props.asset}></AssetBalance>
      <Box style={{ fontWeight: '500' }}>${assetValue(props.asset, 2)}</Box>
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
      <Box direction="row" justify="between">
        <AppLabel>Your share</AppLabel>
        <AppLabel>Value (USD)</AppLabel>
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
              <AssetBalanceRow style={{ marginBottom: '24px' }} asset={asset}></AssetBalanceRow>
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
  title: string;
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

  const raisedCustom = assets
    .filter((token) => token.price === undefined)
    .sort((a, b) => {
      const av = +ethers.utils.formatUnits(a.balance, a.decimals);
      const bv = +ethers.utils.formatUnits(b.balance, b.decimals);
      return av > bv ? -1 : av === bv ? 0 : 1;
    });

  const arrayToStr = (tokens: TokenBalance[]) => {
    /** only add tokens with nonzero balance */
    const filtered = tokens.filter((t) => t.balance !== '0');
    return concatStrings(filtered.map((a) => balanceToStr(a)));
  };

  const balanceToStr = (token: TokenBalance) => {
    const raised = +ethers.utils.formatUnits(token.balance, token.decimals);
    return `${valueToString(raised * ratio, 2)} ${token.name}`;
  };

  const concatStrings = (array: string[]) => {
    return array.reduce((acc, el) => acc.concat(' ' + el), '');
  };

  const { preferredString, secondaryString, has } = (() => {
    const hasValue = rewardUSD > 0;
    const usdString = `$${valueToString(rewardUSD, 2)}`;

    /** if preferred token is defined then it's always the primary */
    if (preferred) {
      return {
        preferredString: balanceToStr(preferred),
        secondaryString: hasValue
          ? `+ ${usdString}`
          : '' + arrayToStr(raisedCustom.filter((a) => a.id !== preferred.id)),
        has: true,
      };
    }

    // else (no preferred)
    if (hasValue) {
      // if it has value, use the usd value as default
      return {
        preferredString: usdString,
        secondaryString: arrayToStr(raisedCustom),
        has: true,
      };
    } else {
      // if not, use the first token with non zero balance as primary
      const nonZero = raisedCustom.find((a) => a.balance !== '0');

      if (nonZero) {
        return {
          preferredString: balanceToStr(nonZero),
          secondaryString: arrayToStr(raisedCustom.filter((a) => a.id !== nonZero.id)),
          has: true,
        };
      } else {
        // there is not value
        return {
          preferredString: usdString,
          secondaryString: '',
          has: false,
        };
      }
    }
  })();

  /** If no preferred asset, then the USD value will be prioritized. */

  return (
    <AppTip
      disabled={!has}
      dropContent={
        <Box style={{ width: '300px', padding: '20px 20px 0px 20px' }}>
          <Box direction="row" justify="between" style={{ margin: '4px 0px 20px 0px' }}>
            <AppLabel>{props.title}</AppLabel>
            <AppLabel>Value</AppLabel>
          </Box>
          {props.assets ? (
            props.assets.map((asset) => {
              return asset.balance !== '0' ? (
                <AssetBalanceRow style={{ marginBottom: '20px' }} asset={asset}></AssetBalanceRow>
              ) : (
                <></>
              );
            })
          ) : (
            <></>
          )}
        </Box>
      }>
      {type === 'card' ? (
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
              textAlign: 'center',
            }}>
            {preferredString}
          </Box>
          {secondaryString !== '' ? (
            <Box direction="row" justify="end">
              +{secondaryString}
            </Box>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <span>
          <b>{preferredString}</b>
          {secondaryString !== '' ? ` + ${secondaryString}` : ''}
        </span>
      )}
    </AppTip>
  );
};
