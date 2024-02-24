/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `TimeStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimeStats_username_key" ON "TimeStats"("username");
