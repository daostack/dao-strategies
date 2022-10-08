import { Box, Spinner } from 'grommet';
import { FC, useCallback, useState } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useCampaignInstance } from '../hooks/useContracts';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useNow } from '../hooks/useNow';
import { lockCampaign } from '../pages/campaign.support';
import { Address } from './Address';

import {
  AppAccordion,
  AppAccordionPanel,
  AppButton,
  AppCallout,
  AppCard,
  AppHeading,
  AppLabel,
  BytesInfo,
  HelpTip,
  HorizontalLine,
} from './styles/BasicElements';
import { styleConstants } from './styles/themes';
import { TransactionCalldata } from './TransactionCalldata';

interface IAdvancedCampaign {
  campaignAddress: string;
}

export const AdvancedCampaignStatus: FC<IAdvancedCampaign> = (props: IAdvancedCampaign) => {
  const { campaign, otherDetails, shares, getOtherDetails } = useCampaignContext();
  const [locking, setLocking] = useState<boolean>(false);

  const { account, connect } = useLoggedUser();

  const campaignInstance = useCampaignInstance(props.campaignAddress);

  const { now } = useNow();

  const locked = otherDetails?.publishInfo?.status.locked !== undefined && otherDetails?.publishInfo?.status.locked;

  const lock = useCallback(async () => {
    if (campaignInstance === undefined) {
      throw new Error('claim info undefined');
    }

    setLocking(true);
    await lockCampaign(campaignInstance, !locked);
    setLocking(false);

    refresh();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignInstance, locked]);

  const refresh = () => {
    getOtherDetails();
    now?.refresh();
  };

  const isLogged = account !== undefined;

  if (!campaign) {
    return (
      <>
        <Spinner></Spinner>
      </>
    );
  }

  if (!otherDetails || !otherDetails.publishInfo || !shares || !now) {
    return <Spinner></Spinner>;
  }

  const nLeafs = otherDetails.root ? otherDetails.root.nLeafs : 0;
  const nReceivers = shares.page && shares.page.total !== undefined ? shares.page.total : 0;
  const hasPending = otherDetails.publishInfo.status.validRoot !== otherDetails.publishInfo.status.pendingRoot;

  const info = {
    nReceivers,
    nPending: nReceivers - nLeafs,
    isProposeWindowActive: otherDetails.publishInfo.status.isProposeWindowActive,
    nextWindowStarts: otherDetails.publishInfo.derived ? otherDetails.publishInfo.derived.nextWindowStarts : 0,
    nextWindowEnds: otherDetails.publishInfo.derived ? otherDetails.publishInfo.derived.nextWindowEnds : 0,
    candidateRoot: hasPending ? otherDetails.publishInfo.status.pendingRoot : undefined,
    activeTime: otherDetails.publishInfo.status.activationTime,
    locked,
  };

  return (
    <Box style={{ marginTop: '50px' }}>
      <AppCard
        align="start"
        style={{
          backgroundColor: styleConstants.colors.highlightedLight,
          color: styleConstants.colors.ligthGrayText2,
        }}>
        {info.candidateRoot ? (
          <>
            <AppHeading level="3" style={{ marginBottom: '16px' }}>
              New update proposed by the oracle!
            </AppHeading>
            <Box style={{ marginBottom: '16px' }}>
              The payment address for another {'N'} contributors has been proposed by the oracle. Will be active in{' '}
              {now.prettyDiff(info.activeTime)}
            </Box>
            <AppButton label="See Update" style={{ alignSelf: 'center' }} primary />
          </>
        ) : (
          <>
            No updates currenly proposed by the oracle. Next update will be done in{' '}
            {now ? now.prettyDiff(info.nextWindowStarts) : ''}
          </>
        )}
      </AppCard>

      <AppCard
        style={{ marginTop: '16px', fontWeight: '500', backgroundColor: styleConstants.colors.highlightedLight }}>
        <Box direction="row" align="center" justify="between" style={{ marginBottom: '32px' }}>
          <Box>No of Campaign Receivers</Box>
          <Box style={{ fontWeight: '700', fontSize: '20px' }}>{info.nReceivers}</Box>
        </Box>
        <Box direction="row" align="center" justify="between">
          <Box>Pending Verification</Box>
          <Box style={{ fontWeight: '700', fontSize: '20px' }}>{info.nPending}</Box>
        </Box>
      </AppCard>

      <HorizontalLine style={{ margin: '40px 0px' }}></HorizontalLine>

      <AppHeading level="3" style={{ marginBottom: '16px' }}>
        Advanced Actions
      </AppHeading>

      <Box direction="row" style={{ marginBottom: '24px' }}>
        Only the admin has permissions to perform the following actions:
        {/* I wanted o add a link to the admin address but it breaks the paragraph. Googled it without luck
          ({<Address
          address={campaign.guardian}
          chainId={campaign.chainId}
          style={{ margin: '0px 2px', display: 'inline' }}></Address>})  */}
      </Box>

      <AppAccordion style={{}}>
        <AppAccordionPanel label={'Cancel Pending merkleroot'} subtitle={'Description of the Admin action'}>
          <TransactionCalldata
            address={campaign.address}
            chainId={campaign.chainId}
            method="setLock"
            params={[true]}
            value={'0'}></TransactionCalldata>
        </AppAccordionPanel>

        <AppAccordionPanel
          label={'Lock Campaign'}
          subtitle={'Description of the Admin action'}
          style={{ marginTop: '16px' }}>
          <Box>Cancel the campaign</Box>
          <AppButton>Cancel</AppButton>
        </AppAccordionPanel>
      </AppAccordion>

      <AppCard style={{ marginTop: '24px' }}>
        <Box style={{ marginTop: '8px' }} direction="row">
          Created by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.creatorId} chainId={campaign.chainId}></Address>
        </Box>
        <Box direction="row">
          Guarded by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.guardian} chainId={campaign.chainId}></Address>
        </Box>
        <Box direction="row">
          Oracle: <Address style={{ marginLeft: '8px' }} address={campaign.oracle} chainId={campaign.chainId}></Address>
        </Box>
      </AppCard>

      {/* <AppButton secondary label="Refresh" onClick={() => refresh()} /> */}
    </Box>
  );
};
