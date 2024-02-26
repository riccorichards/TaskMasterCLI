/*
  Warnings:

  - The primary key for the `DailyTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `DailyTask` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DailyTask" DROP CONSTRAINT "DailyTask_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "DailyTask_pkey" PRIMARY KEY ("id");
