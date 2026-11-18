-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "isRevertOpen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OpeningBalanceHeader" ADD COLUMN     "isRevert" "Revert" NOT NULL DEFAULT 'N',
ADD COLUMN     "isRevertOpen" BOOLEAN NOT NULL DEFAULT false;
