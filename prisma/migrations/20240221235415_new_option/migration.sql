/*
  Warnings:

  - You are about to drop the `Act` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `DailyTask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `TimeStats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `DailyTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `TimeStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyTask" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeStats" ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Act";

-- CreateIndex
CREATE UNIQUE INDEX "DailyTask_username_key" ON "DailyTask"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Note_username_key" ON "Note"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TimeStats_username_key" ON "TimeStats"("username");
