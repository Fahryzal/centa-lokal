-- CreateTable
CREATE TABLE "CashBankTransactionDetails" (
    "id" TEXT NOT NULL,
    "cashBankTransactionId" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "unitId" TEXT,
    "accountCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "debit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "credit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashBankTransactionDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashBankTransactionDetails" ADD CONSTRAINT "CashBankTransactionDetails_cashBankTransactionId_fkey" FOREIGN KEY ("cashBankTransactionId") REFERENCES "CashBankTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransactionDetails" ADD CONSTRAINT "CashBankTransactionDetails_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransactionDetails" ADD CONSTRAINT "CashBankTransactionDetails_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
