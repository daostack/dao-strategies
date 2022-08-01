-- CreateEnum
CREATE TYPE "CampaignState" AS ENUM ('PendingExecution', 'PendingIdentityValidation', 'MerkleRootSet');

-- CreateTable
CREATE TABLE "Campaign" (
    "uri" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "creatorId" TEXT,
    "nonce" INTEGER NOT NULL,
    "chainId" INTEGER,
    "asset" TEXT,
    "guardian" TEXT,
    "oracle" TEXT,
    "activationTime" INTEGER,
    "CHALLENGE_PERIOD" INTEGER,
    "ACTIVATION_PERIOD" INTEGER,
    "ACTIVE_DURATION" INTEGER,
    "stratID" TEXT NOT NULL,
    "stratParamsStr" TEXT NOT NULL,
    "lastRunDate" BIGINT,
    "execDate" BIGINT,
    "publishDate" BIGINT,
    "republishDate" BIGINT,
    "cancelDate" BIGINT,
    "registered" BOOLEAN,
    "running" BOOLEAN,
    "executed" BOOLEAN,
    "published" BOOLEAN,
    "address" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("uri")
);

-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL,
    "verifiedGithub" TEXT,
    "signedGithub" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Reward" (
    "account" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("campaignId","account")
);

-- CreateTable
CREATE TABLE "CampaignRoot" (
    "order" INTEGER NOT NULL,
    "campaignId" TEXT NOT NULL,
    "root" TEXT NOT NULL,
    "date" BIGINT NOT NULL,

    CONSTRAINT "CampaignRoot_pkey" PRIMARY KEY ("campaignId","order")
);

-- CreateTable
CREATE TABLE "BalanceLeaf" (
    "campaignId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "account" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "proof" TEXT[],

    CONSTRAINT "BalanceLeaf_pkey" PRIMARY KEY ("campaignId","order","address")
);

-- CreateTable
CREATE TABLE "AssetPrice" (
    "chainId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "lastUpdated" BIGINT NOT NULL,

    CONSTRAINT "AssetPrice_pkey" PRIMARY KEY ("chainId","address")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRoot" ADD CONSTRAINT "CampaignRoot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceLeaf" ADD CONSTRAINT "BalanceLeaf_campaignId_order_fkey" FOREIGN KEY ("campaignId", "order") REFERENCES "CampaignRoot"("campaignId", "order") ON DELETE RESTRICT ON UPDATE CASCADE;
