import { CampaignReadDetails } from '@dao-strategies/core';
import { Box } from 'grommet';
import { FC } from 'react';
import { IElement } from './styles/BasicElements';

export interface ICampaignCard extends IElement {
  campaign: CampaignReadDetails;
}

export const CampaignCard: FC<ICampaignCard> = (props: ICampaignCard) => {
  return (
    <Box style={{ borderRadius: '18px' }} border="all" pad="large">
      <Box>{props.campaign.guardian}</Box>
      <Box>{props.campaign.title}</Box>
      <Box>{props.campaign.description}</Box>
      <Box>{props.campaign.address}</Box>
    </Box>
  );
};
