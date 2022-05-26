/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Campaign_address_key" ON "Campaign"("address");
