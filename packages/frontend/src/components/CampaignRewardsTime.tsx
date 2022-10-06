import { CampaignFundersRead, campaignInstance, Page } from '@dao-strategies/core';
import { parseEther } from 'ethers/lib/utils';
import { Box, Spinner, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { useNow } from '../hooks/useNow';
import { FieldLabel } from '../pages/create/field.label';
import { DateManager } from '../utils/date.manager';

import { Countdown } from './Countdown';

export interface CampaignRewardsTimeI {
  alreadyExecuted: boolean;
  execDate: number;
}

export const CampaignRewardsTime: FC<CampaignRewardsTimeI> = (props: CampaignRewardsTimeI) => {
  const { execDate, alreadyExecuted } = props;
  const { now } = useNow();

  return (
    <Box style={{ color: '#878787' }}>
      {alreadyExecuted
        ? (<FieldLabel helpIconPosition='left' help="true" label={`Campaign shares successfully distributed ${now?.intervalDuration(new Date(), execDate).days} days ago`}></FieldLabel>)
        : (<Countdown to-date={execDate} text='Shares distributed in:'>  </Countdown>)}
    </Box>
  )
};

//Default prop values
CampaignRewardsTime.defaultProps = {
}