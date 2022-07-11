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
    "stratID" TEXT NOT NULL,
    "stratParamsStr" TEXT NOT NULL,
    "lastRunDate" BIGINT,
    "execDate" BIGINT,
    "publishDate" BIGINT,
    "cancelDate" BIGINT,
    "registered" BOOLEAN NOT NULL,
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

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;
