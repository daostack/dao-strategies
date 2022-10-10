import { Asset, campaignInstance, ChainsDetails, erc20Instance, TokenBalance } from '@dao-strategies/core';
import { BigNumber, ethers } from 'ethers';
import { Select, Box, FormField, Spinner } from 'grommet';
import { FC, useCallback, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useNowContext } from '../hooks/useNow';
import { DateManager } from '../utils/date.manager';
import { Address } from './Address';
import { AssetBalance, AssetIcon } from './Assets';
import { AssetsInput, SelectedInputDetails } from './AssetsInput';
import { AppButton, IElement, AppHeading, AppLabel, HorizontalLine, AppCallout } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

interface IFundCampaign extends IElement {
  asset?: string;
  assets: Asset[];
  chainId: number;
  address: string;
  defaultAsset?: Asset;
  onSuccess?: () => void;
}

export const FundCampaign: FC<IFundCampaign> = (props: IFundCampaign) => {
  const [funding, setFunding] = useState<boolean>(false);
  const [approving, setApproving] = useState<boolean>(false);
  const [signing, setSigning] = useState<boolean>(false);

  const [selected, setSelected] = useState<SelectedInputDetails>();

  const { account, connect } = useLoggedUser();
  const { campaign, fundEvents, getFundEvents } = useCampaignContext();
  const { now } = useNowContext();

  const isNative = selected ? ChainsDetails.isNative(selected.asset) : false;

  const { data: signer } = useSigner();

  useEffect(() => {
    getFundEvents();
  }, []);

  const isLogged = account !== undefined;

  const fund = useCallback(async () => {
    if (!isLogged) {
      connect();
      return;
    }

    if (selected === undefined) throw new Error('selected asset undefined');
    if (signer == null) throw new Error('Signer null');

    let tx;
    const campaign = campaignInstance(props.address, signer);
    const value = BigNumber.from(selected.asset.balance);

    if (isNative) {
      setFunding(true);
      tx = await campaign.fund(ethers.constants.AddressZero, 0, { value });
    } else {
      const token = erc20Instance(selected.asset.address, signer);
      const approved = await token.allowance(account, props.address);

      if (approved.sub(value).lt(0)) {
        try {
          setApproving(true);
          const tx = await token.approve(props.address, value.sub(approved));
          await tx.wait();
          setApproving(false);
        } catch (e) {
          setApproving(false);
        }
      }

      setSigning(true);
      try {
        tx = await campaign.fund(selected.asset.address, value);
        setSigning(false);
      } catch (e) {
        setSigning(false);
      }
    }

    if (tx) {
      setFunding(true);
      try {
        const res = await tx.wait();
        console.log('funded', { res });
        setFunding(false);
        if (props.onSuccess !== undefined) props.onSuccess();
      } catch (e) {
        setFunding(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, selected, signer, isNative, account]);

  /** campaign should always be defined if the fund dialog is shown */
  const zero = selected && selected.asset.balance === '0';
  const chainId = campaign ? campaign.chainId : 0;
  const notEnoughFunds = selected?.status === 'not-enough-funds';

  const label = (() => {
    if (approving) {
      return `Approving Allowance...`;
    }

    if (signing) {
      return `Waiting for tx approval...`;
    }

    if (funding) {
      return `Tx Pending...`;
    }

    if (isLogged) {
      if (!zero) {
        if (isNative) {
          return 'Fund';
        } else {
          return 'Approve & Fund';
        }
      } else {
        return 'Chose the amount to fund';
      }
    } else {
      return 'Connect to Fund';
    }
  })();

  const disabled = (zero && isLogged) || notEnoughFunds || funding || approving || signing;

  const funds = fundEvents ? (
    fundEvents.map((fundEvent, ix) => {
      const ts = new DateManager(fundEvent.timestamp);
      const since = now ? `${ts.prettyDiff(now.getTimeDynamic())} ago` : '';
      const chain = ChainsDetails.chainOfId(chainId);
      const exploreUrl = chain && chain.exploreTx ? chain.exploreTx(fundEvent.txHash) : undefined;

      return (
        <Box align="stretch" style={{ flexShrink: '0' }}>
          {ix > 0 ? <HorizontalLine style={{ margin: '16px 0px' }}></HorizontalLine> : <></>}
          <Box
            direction="row"
            align="center"
            justify="between"
            style={{ fontSize: styleConstants.textFontSizes.xsmall }}>
            <AppLabel style={{ marginBottom: '12px' }}>Funding</AppLabel>
            <Box>
              {exploreUrl ? (
                <a
                  style={{ color: styleConstants.colors.ligthGrayText }}
                  href={exploreUrl}
                  target="_blank"
                  rel="noreferrer">
                  {since}
                </a>
              ) : (
                since
              )}
            </Box>
          </Box>
          <Box
            direction="row"
            align="center"
            justify="between"
            style={{ fontSize: styleConstants.textFontSizes.normalSmaller }}>
            <Box>
              <AssetBalance asset={fundEvent.asset}></AssetBalance>
            </Box>
            <Box>
              <Address
                chainId={chainId}
                address={fundEvent.funder}
                style={{ color: styleConstants.colors.ligthGrayText }}></Address>
            </Box>
          </Box>
        </Box>
      );
    })
  ) : (
    <></>
  );

  return (
    <>
      <Box style={{ width: '100%', ...props.style }} direction="column" align="start">
        <AssetsInput
          assets={props.assets}
          defaultAsset={props.defaultAsset}
          chainId={props.chainId}
          onAssetSelected={(details) => setSelected(details)}></AssetsInput>
        <AppButton
          label={
            <Box direction="row" align="center" justify="center">
              {label} {disabled ? <Spinner></Spinner> : <></>}
            </Box>
          }
          primary
          disabled={disabled}
          onClick={() => fund()}
          style={{ marginTop: '20px', width: '100%' }}
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
        <Box style={{ width: '100%', marginTop: '80px' }}>
          <AppHeading level={4} style={{ color: styleConstants.colors.lightGrayTextDarker }}>
            Funding History
          </AppHeading>
          <Box fill style={{ overflowY: 'auto', marginTop: '40px' }}>
            {fundEvents ? funds : <AppCallout>This campaign has not yet been funded</AppCallout>}
          </Box>
        </Box>
      </Box>
    </>
  );
};
