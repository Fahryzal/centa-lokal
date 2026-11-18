-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "isPosted" TEXT NOT NULL DEFAULT 'Y';

-- CreateTable
CREATE TABLE "OpeningBankDetails" (
    "id" TEXT NOT NULL,
    "headerId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fiscalYear" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "OpeningBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpeningBankDetails_accountCode_headerId_key" ON "OpeningBankDetails"("accountCode", "headerId");

-- AddForeignKey
ALTER TABLE "OpeningBankDetails" ADD CONSTRAINT "OpeningBankDetails_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBankDetails" ADD CONSTRAINT "OpeningBankDetails_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBankDetails" ADD CONSTRAINT "OpeningBankDetails_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBankDetails" ADD CONSTRAINT "OpeningBankDetails_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
