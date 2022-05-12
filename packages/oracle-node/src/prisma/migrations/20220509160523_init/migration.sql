/*
  Warnings:

  - You are about to drop the column `stratParams` on the `Campaign` table. All the data in the column will be lost.
  - The primary key for the `Reward` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Reward` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `lastSimDate` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stratParamsStr` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `execDate` on the `Campaign` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cancelDate` on the `Campaign` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `account` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_userId_fkey";

-- DropIndex
DROP INDEX "User_address_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "stratParams",
ADD COLUMN     "lastSimDate" BIGINT NOT NULL,
ADD COLUMN     "nonce" INTEGER NOT NULL,
ADD COLUMN     "stratParamsStr" TEXT NOT NULL,
ALTER COLUMN "creatorId" SET DATA TYPE TEXT,
DROP COLUMN "execDate",
ADD COLUMN     "execDate" BIGINT NOT NULL,
DROP COLUMN "cancelDate",
ADD COLUMN     "cancelDate" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_pkey",
DROP COLUMN "userId",
ADD COLUMN     "account" TEXT NOT NULL,
ADD COLUMN     "amount" BIGINT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reward_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reward_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "github" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("address");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
