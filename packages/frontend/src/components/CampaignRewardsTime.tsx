import { CampaignFundersRead, campaignInstance, Page } from '@dao-strategies/core';
import { parseEther } from 'ethers/lib/utils';
import { Box, Spinner } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { DateManager } from '../utils/date.manager';

import { Countdown } from './Countdown';

export interface CampaignRewardsTimeI {
  alreadyExecuted: boolean;
  execDate: number;
  compactFormat: boolean;
}

export const CampaignRewardsTime: FC<CampaignRewardsTimeI> = (props: CampaignRewardsTimeI) => {
  const { campaign } = useCampaignContext();
  const { execDate, alreadyExecuted } = props;

  return (

    <Box>
      <Countdown to-date={execDate}> Shares distributed in: </Countdown>
    </Box>
  )
};

//Default prop values
CampaignRewardsTime.defaultProps = {
  compactFormat: false,
}