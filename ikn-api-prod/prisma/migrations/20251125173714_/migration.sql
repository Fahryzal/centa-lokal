/*
  Warnings:

  - A unique constraint covering the columns `[unitId,accountCode,period]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BankAccount_accountCode_key";

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "period" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_unitId_accountCode_period_key" ON "BankAccount"("unitId", "accountCode", "period");
