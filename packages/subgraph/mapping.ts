// import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  EthCampaignCreated,
  Erc20CampaignCreated,
} from './generated/CampaignFactory/CampaignFactory';
import { Campaign } from './generated/schema';

export function handleEthCampaignCreated(event: Erc20CampaignCreated): void {
  let campaign = new Campaign(
    event.params.creator.toHex() + event.params.salt.toHex()
  );

  campaign.creator = event.params.creator;
  campaign.address = event.params.newCampaign;

  campaign.save();
}

export function handleErc20CampaignCreated(event: EthCampaignCreated): void {
  let campaign = new Campaign(
    event.params.creator.toHex() + event.params.salt.toHex()
  );

  campaign.creator = event.params.creator;
  campaign.address = event.params.newCampaign;

  campaign.save();
}
