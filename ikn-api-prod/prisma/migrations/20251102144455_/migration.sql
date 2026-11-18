/*
  Warnings:

  - Added the required column `namaAccount` to the `Tax` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tax" ADD COLUMN     "namaAccount" TEXT NOT NULL;
