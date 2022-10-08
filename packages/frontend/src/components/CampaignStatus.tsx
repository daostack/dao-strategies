import { Box, BoxExtendedProps, Text } from 'grommet';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { useNow } from '../hooks/useNow';
import { Address } from './Address';

import { Countdown } from './Countdown';
import { HelpTip } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface CampaignStatusI extends BoxExtendedProps {}

export const CampaignStatus: FC<CampaignStatusI> = (props: CampaignStatusI) => {
  const { campaign } = useCampaignContext();
  const { now } = useNow();

  if (!campaign || !now) {
    return <></>;
  }

  const tip = (
    <HelpTip
      style={{ marginRight: '10.5px' }}
      iconSize="15px"
      content={
        campaign.executed
          ? 'The contributors of this campaign have already been computed and they wont be updated.'
          : 'At the end of this counter, the contributors of this campaign will be computed based on its rules'
      }
    />
  );

  const status = (
    <Box direction="row" style={{ flexGrow: '1' }}>
      {campaign.executed ? (
        <Box direction="row" align="center">
          {tip} Campaign shares successfully distributed {now.prettyDiff(campaign.execDate)} ago
        </Box>
      ) : (
        <div>
          <Box direction="row" align="center" style={{ float: 'left', marginRight: '6px' }}>
            {tip} Shares distributed in:
          </Box>
          <Countdown toDate={campaign.execDate} style={{ float: 'left' }}></Countdown>
        </div>
      )}
    </Box>
  );

  return (
    <Box
      style={{
        color: styleConstants.colors.ligthGrayText2,
        fontSize: styleConstants.textFontSizes.small,
        ...props.style,
      }}
      direction="row"
      justify="between">
      {status}
      <Box direction="row" align="center" style={{ flexShrink: '0' }}>
        Created by: <Address style={{ marginLeft: '2px' }} address={campaign.creatorId} chainId={campaign.chainId} />
      </Box>
    </Box>
  );
};
