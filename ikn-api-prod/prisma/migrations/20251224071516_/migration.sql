-- DropIndex
DROP INDEX "CashBankTransaction_invoiceEksporId_key";

-- DropIndex
DROP INDEX "CashBankTransaction_invoiceId_key";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "downPayment" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "InvoiceEkspor" ADD COLUMN     "donePayment" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RawMaterialReceipt" ADD COLUMN     "downPayment" DECIMAL(65,30);
