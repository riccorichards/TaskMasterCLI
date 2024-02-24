/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyTask_username_key";

-- DropIndex
DROP INDEX "Note_username_key";

-- DropIndex
DROP INDEX "TimeStats_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
