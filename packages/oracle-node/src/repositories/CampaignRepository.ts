import { Balances } from '@dao-strategies/core';
import { PrismaClient, Prisma, Campaign } from '@prisma/client';
import { BigNumber } from 'ethers';

import { CampaignCreateDetails } from '../services/types';

export class CampaignRepository {
  constructor(protected client: PrismaClient) {}

  async create(campaignDetails: Prisma.CampaignCreateInput): Promise<Campaign> {
    return this.client.campaign.create({
      data: campaignDetails,
    });
  }

  async get(uri: string): Promise<Campaign> {
    return this.client.campaign.findUnique({ where: { uri } });
  }

  async getFromAddress(address: string): Promise<Campaign> {
    const res = await this.client.campaign.findFirst({
      where: { address: address.toLowerCase() },
    });
    return res;
  }

  async exist(uri: string): Promise<boolean> {
    return this.client.campaign
      .findFirst({ where: { uri: uri } })
      .then(Boolean);
  }

  async getLastSimDate(uri: string): Promise<number | undefined> {
    const result = await this.client.campaign.findUnique({
      where: { uri: uri },
      select: { lastSimDate: true },
    });

    if (result === null) {
      return undefined;
    }

    /** "BigInt" in the DB to support timestamps beyond 2038, "number" in JS */
    return result.lastSimDate === null ? undefined : Number(result.lastSimDate);
  }

  async setLastSimDate(uri: string, date: number): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { lastSimDate: date },
    });
  }

  async getRewards(uri: string): Promise<Balances> {
    const result = await this.client.campaign.findUnique({
      where: { uri: uri },
      include: {
        rewards: true,
      },
    });

    const balances: Balances = new Map();
    result.rewards.forEach((reward) => {
      balances.set(reward.account, BigNumber.from(reward.amount));
    });

    return balances;
  }

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    const rewardsArray = Array.from(rewards.entries()).map(
      ([account, amount]) => {
        return { account, amount: amount.toBigInt(), campaignId: uri };
      }
    );

    const deleteExisting = this.client.reward.deleteMany({
      where: {
        campaign: {
          uri,
        },
      },
    });

    const addNew = this.client.reward.createMany({ data: rewardsArray });

    await this.client.$transaction([deleteExisting, addNew]);
  }

  async setDetails(uri: string, details: CampaignCreateDetails): Promise<void> {
    details.address = details.address.toLowerCase();
    await this.client.campaign.update({ where: { uri }, data: details });
  }
}
