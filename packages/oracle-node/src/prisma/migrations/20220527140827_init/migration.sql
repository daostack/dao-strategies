-- CreateEnum
CREATE TYPE "CampaignState" AS ENUM ('PendingExecution', 'PendingIdentityValidation', 'MerkleRootSet');

-- CreateTable
CREATE TABLE "Campaign" (
    "uri" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "guardian" TEXT NOT NULL,
    "oracle" TEXT NOT NULL,
    "execDate" BIGINT NOT NULL,
    "cancelDate" BIGINT NOT NULL,
    "stratID" TEXT NOT NULL,
    "stratParamsStr" TEXT NOT NULL,
    "lastSimDate" BIGINT NOT NULL,
    "registered" BOOLEAN NOT NULL,
    "address" TEXT NOT NULL,

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
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;
