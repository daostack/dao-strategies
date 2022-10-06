import { Asset, campaignInstance, ChainsDetails, erc20Instance, TokenBalance } from '@dao-strategies/core';
import { BigNumber, ethers } from 'ethers';
import { Select, Box, FormField, Spinner } from 'grommet';
import { FC, useCallback, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

import { useBalanceOf } from '../hooks/useBalanceOf';
import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useNow } from '../hooks/useNow';
import { DateManager } from '../utils/date.manager';
import { valueToString } from '../utils/general';
import { Address } from './Address';
import { AssetBalance, AssetIcon } from './Assets';
import { AssetsInput, SelectedInputDetails } from './AssetsInput';
import { AppForm, AppButton, IElement, AppInput, AppHeading, AppLabel, HorizontalLine } from './styles/BasicElements';
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

  const [selected, setSelected] = useState<SelectedInputDetails>();

  const { account, connect } = useLoggedUser();
  const { campaign, fundEvents, getFundEvents } = useCampaignContext();
  const { now } = useNow();

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
        setApproving(true);
        const tx = await token.approve(props.address, value.sub(approved));
        try {
          await tx.wait();
        } catch (e) {
          setApproving(false);
        }
        setApproving(false);
      }

      setFunding(true);
      tx = await campaign.fund(selected.asset.address, value);
    }

    const res = await tx.wait();
    console.log('funded', { res });
    setFunding(false);

    if (props.onSuccess !== undefined) props.onSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, selected, signer, isNative, account]);

  const label = approving
    ? `Approving Allowance...`
    : funding
    ? `Tx Pending...`
    : isLogged
    ? isNative
      ? 'Fund'
      : 'Approve & Fund'
    : 'Connecto to Fund';

  /** campaign should always be defined if the fund dialog is shown */
  const chainId = campaign ? campaign.chainId : 0;
  const notEnoughFunds = selected?.status === 'not-enough-funds';

  return (
    <>
      <Box style={{ width: '100%', ...props.style }} direction="column" align="start">
        <AssetsInput
          assets={props.assets}
          defaultAsset={props.defaultAsset}
          chainId={props.chainId}
          onAssetSelected={(details) => setSelected(details)}></AssetsInput>
        <AppButton
          label={label}
          primary
          disabled={notEnoughFunds || funding}
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
            {fundEvents ? (
              fundEvents.map((fundEvent, ix) => {
                const ts = new DateManager(fundEvent.timestamp);
                const since = now ? `${ts.prettyDiff(now.getTime())} ago` : '';
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
                      <AppLabel>Funding</AppLabel>
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
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
