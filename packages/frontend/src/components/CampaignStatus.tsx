import { Box, BoxExtendedProps, Text } from 'grommet';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { useNowContext } from '../hooks/useNow';
import { DateManager } from '../utils/date.manager';
import { Address } from './Address';

import { TwoColumns } from './landing/TwoColumns';
import { HelpTip } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface CampaignStatusI extends BoxExtendedProps {}

export const CampaignStatus: FC<CampaignStatusI> = (props: CampaignStatusI) => {
  const { campaign } = useCampaignContext();
  const { now } = useNowContext();

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
    <Box direction="row" style={{ flexGrow: '1', paddingRight: '40px' }}>
      {campaign.executed ? (
        <Box direction="row" align="center">
          {tip} Campaign shares successfully distributed {now.prettyDiff(campaign.execDate)} ago
        </Box>
      ) : (
        <div>
          <Box direction="row" align="center" style={{ float: 'left', marginRight: '6px' }}>
            {tip} Shares will be distributed in{' '}
            <b style={{ marginLeft: '4px' }}>{DateManager.from(campaign.execDate).prettyDiff(now.getTimeDynamic())}</b>
          </Box>
        </div>
      )}
    </Box>
  );

  return (
    <TwoColumns
      widths={['70%', '30%']}
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
    </TwoColumns>
  );
};
