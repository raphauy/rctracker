/*
  Warnings:

  - You are about to drop the column `estimatedHours` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "estimatedHours",
ADD COLUMN     "estimatedHoursMax" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estimatedHoursMin" INTEGER NOT NULL DEFAULT 0;
