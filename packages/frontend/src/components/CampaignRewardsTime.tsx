import { Box, Text } from 'grommet';
import { FC } from 'react';
import { useNow } from '../hooks/useNow';
import { DateManager } from '../utils/date.manager';

import { Countdown } from './Countdown';
import { ENSProfile } from './ENSProfile';
import { HelpTip } from './styles/BasicElements';

export interface CampaignRewardsTimeI {
  alreadyExecuted: boolean;
  execDate: number;
}

export const CampaignRewardsTime: FC<CampaignRewardsTimeI> = (props: CampaignRewardsTimeI) => {
  const { execDate, alreadyExecuted } = props;
  const { now } = useNow();

  return (
    <Box style={{ color: '#878787' }} direction="row" justify="between">
      {alreadyExecuted ? (
        now ? (
          <HelpTip helpIconPosition={'left'} helpText={'Help'}>
            <Text>
              `Campaign shares successfully distributed ${DateManager.intervalDuration(now.getTime(), execDate).days}{' '}
              days ago`
            </Text>
          </HelpTip>
        ) : (
          <></>
        )
      ) : (
        <Countdown to-date={execDate} text="Shares distributed in:">
          {' '}
        </Countdown>
      )}
      <ENSProfile text={'Created by:'} />
    </Box>
  );
};

//Default prop values
CampaignRewardsTime.defaultProps = {};
