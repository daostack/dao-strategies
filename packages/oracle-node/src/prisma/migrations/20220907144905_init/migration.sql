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
    "customAssets" TEXT[],
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "CrossVerification" (
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "proof" TEXT NOT NULL,

    CONSTRAINT "CrossVerification_pkey" PRIMARY KEY ("from","to","intent")
);

-- CreateTable
CREATE TABLE "Share" (
    "account" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("campaignId","account")
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
    "accounts" TEXT[],
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

-- CreateTable
CREATE TABLE "FundEvent" (
    "hash" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "funderAddress" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,

    CONSTRAINT "FundEvent_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "CampaignIndex" (
    "campaignId" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,

    CONSTRAINT "CampaignIndex_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "CampaignFunder" (
    "campaignId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CampaignFunder_pkey" PRIMARY KEY ("campaignId","address")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRoot" ADD CONSTRAINT "CampaignRoot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceLeaf" ADD CONSTRAINT "BalanceLeaf_campaignId_order_fkey" FOREIGN KEY ("campaignId", "order") REFERENCES "CampaignRoot"("campaignId", "order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundEvent" ADD CONSTRAINT "FundEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundEvent" ADD CONSTRAINT "FundEvent_campaignId_funderAddress_fkey" FOREIGN KEY ("campaignId", "funderAddress") REFERENCES "CampaignFunder"("campaignId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignIndex" ADD CONSTRAINT "CampaignIndex_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignFunder" ADD CONSTRAINT "CampaignFunder_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;
