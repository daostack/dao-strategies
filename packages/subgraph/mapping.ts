import { CampaignCreated } from './generated/CampaignFactory/CampaignFactory';
import { Campaign } from './generated/schema';

export function handleCampaignCreated(event: CampaignCreated): void {
  let campaign = new Campaign(
    event.params.creator.toHex() + event.params.salt.toHex()
  );

  campaign.creator = event.params.creator;
  campaign.address = event.params.newCampaign;

  campaign.save();
}
