/*
  Warnings:

  - The primary key for the `Reward` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Reward` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Campaign_address_key";

-- AlterTable
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Reward_pkey" PRIMARY KEY ("campaignId", "account");
