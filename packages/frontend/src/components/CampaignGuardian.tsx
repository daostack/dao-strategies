import { Box, Spinner, Text } from 'grommet';
import { Refresh } from 'grommet-icons';
import { FC } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useNow } from '../hooks/useNow';

import { AppButton } from './styles/BasicElements';

interface ICampaignAdmin {
  campaignAddress: string;
}

export const CampaignGuardian: FC<ICampaignAdmin> = (props: ICampaignAdmin) => {
  const { campaign, otherDetails, shares, getOtherDetails } = useCampaignContext();
  const { account } = useLoggedUser();
  const { now } = useNow();

  const refresh = () => {
    getOtherDetails();
    now?.refresh();
  };

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
  const nReceivers = shares.total;
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
  };

  const boxStyle: React.CSSProperties = {
    marginBottom: '16px',
    border: 'solid 2px',
    padding: '16px',
    borderRadius: '16px',
    width: '600px',
  };

  return (
    <Box align="center" justify="center" pad="medium">
      <Refresh onClick={() => refresh()}></Refresh>
      <Box style={boxStyle}>
        Number of campaign receivers: {info.nReceivers}
        <br></br>
        Pending identity verification: {info.nPending}
      </Box>

      <Box style={boxStyle}>
        {info.isProposeWindowActive ? (
          <>Campaign rewards can be updated by oracle. Update window will remain open for {info.timeToNextWindowEnds}</>
        ) : (
          <>
            Campaign rewards cannot be currently updated by oracle. Next update window starts in{' '}
            {info.timeToNextWindowStarts}
          </>
        )}
      </Box>

      <Box style={boxStyle}>
        {info.candidateRoot ? (
          <>
            New rewards published by the oracle {info.candidateRoot}. Will be active on {info.timeToActive}
            {account === campaign.guardian ? <AppButton primary>Block</AppButton> : <></>}
          </>
        ) : (
          <>No rewards update currently proposed by the oracle</>
        )}
      </Box>

      <Box style={boxStyle}>
        Close the campaign (no further updates by the oracle will be possible)
        {account === campaign.guardian ? <AppButton primary>Lock</AppButton> : <></>}
      </Box>
    </Box>
  );
};
