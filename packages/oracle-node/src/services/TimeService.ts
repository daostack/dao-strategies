import { CampaignRepository } from '../repositories/campaignRepository';

export class TimeService {
  constructor() {}

  now(): number {
    return Date.now();
  }
}
