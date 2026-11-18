/*
  Warnings:

  - Added the required column `date` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IsRoot" AS ENUM ('Y', 'N');

-- CreateEnum
CREATE TYPE "Revert" AS ENUM ('Y', 'N');

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "isRevert" "Revert" NOT NULL DEFAULT 'N';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isRoot" "IsRoot" NOT NULL DEFAULT 'N';

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
