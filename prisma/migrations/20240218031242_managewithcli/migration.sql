/*
  Warnings:

  - You are about to drop the column `spentMs` on the `DailyTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyTask" DROP COLUMN "spentMs",
ADD COLUMN     "spendMs" INTEGER NOT NULL DEFAULT 0;
