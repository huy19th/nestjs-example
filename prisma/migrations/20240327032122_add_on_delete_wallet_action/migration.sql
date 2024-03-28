-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toId_fkey";

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
