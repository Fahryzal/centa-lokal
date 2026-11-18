-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'APPLIED', 'DISMISSED');

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "addjust" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "kebun" TEXT;

-- CreateTable
CREATE TABLE "JournalAdjustmentSuggestion" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" TIMESTAMP(3),
    "appliedBy" TEXT,
    "changes" JSONB NOT NULL,

    CONSTRAINT "JournalAdjustmentSuggestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalAdjustmentSuggestion" ADD CONSTRAINT "JournalAdjustmentSuggestion_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
