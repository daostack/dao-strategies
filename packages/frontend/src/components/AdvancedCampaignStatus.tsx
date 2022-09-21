import { Box, Spinner } from 'grommet';
import { FC, useCallback, useState } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useCampaignInstance } from '../hooks/useContracts';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useNow } from '../hooks/useNow';
import { lockCampaign } from '../pages/campaign.support';

import { AppButton, AppCard, AppHeading } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

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
    timeToNextWindowStarts: otherDetails.publishInfo.derived
      ? otherDetails.publishInfo.derived.nextWindowStarts > now.getTime()
        ? otherDetails.publishInfo.derived.nextWindowStarts - now.getTime()
        : 0
      : 0,
    timeToNextWindowEnds: otherDetails.publishInfo.derived
      ? otherDetails.publishInfo.derived.nextWindowEnds > now.getTime()
        ? otherDetails.publishInfo.derived.nextWindowEnds - now.getTime()
        : 0
      : 0,
    candidateRoot: hasPending ? otherDetails.publishInfo.status.pendingRoot : undefined,
    timeToActive: otherDetails.publishInfo.status.activationTime - now.getTime(),
    locked,
  };

  const cardsStyle: React.CSSProperties = { width: '100%', marginBottom: '24px' };

  return (
    <Box align="center" justify="center" pad="medium">
      <AppCard direction="row" align="center" style={cardsStyle}>
        <AppHeading
          level="2"
          style={{
            marginRight: '12px',
          }}>
          {info.nPending}
        </AppHeading>
        <Box> contributors have not yet set their payment address and cannot receive their reward (see list)</Box>
      </AppCard>

      <AppCard align="start" style={cardsStyle}>
        {info.candidateRoot ? (
          <>
            <AppHeading level="3" style={{ marginBottom: '16px' }}>
              New update proposed by the oracle!
            </AppHeading>
            <Box style={{ marginBottom: '16px' }}>
              The payment address for another {'N'} contributors has been proposed by the oracle. Will be active in{' '}
              {info.timeToActive}
            </Box>
            <AppButton style={{ alignSelf: 'center' }} primary>
              See Update
            </AppButton>
          </>
        ) : (
          <>
            No updates currenly proposed by the oracle. Next update will be done in {info.timeToNextWindowStarts} (only
            if some pending contributors set their payment address)
          </>
        )}
      </AppCard>

      <AppCard style={cardsStyle}>
        <AppHeading level="3" style={{ marginBottom: '16px' }}>
          Advanced Actions
        </AppHeading>
        {!isLogged ? <AppButton onClick={() => connect()}>Connect Wallet</AppButton> : <></>}
        <Box direction="row" justify="between" align="center">
          <Box>{info.locked ? 'Unlock' : 'Lock'} the campaign</Box>
          <AppButton onClick={() => lock()}>{info.locked ? 'Unlock' : 'Lock'}</AppButton>
        </Box>

        <Box direction="row" justify="between" align="center">
          <Box>Cancel the campaign</Box>
          <AppButton>Cancel</AppButton>
        </Box>

        {locking ? (
          <Box>
            Waiting for tx...<br></br>
            <br></br>
            <Spinner></Spinner>
          </Box>
        ) : (
          <></>
        )}
      </AppCard>

      <AppButton onClick={() => refresh()}>Refresh</AppButton>
    </Box>
  );
};
