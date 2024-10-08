/*
  Warnings:

  - You are about to drop the column `ammount` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "identify" TEXT,
    "transactionDescription" TEXT,
    "message" TEXT,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" DATETIME,
    CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client" ("accountId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transactions" ("accountId", "createdAT", "id", "identify", "message", "status", "transactionDescription", "transactionId", "transactionType", "updatedAT") SELECT "accountId", "createdAT", "id", "identify", "message", "status", "transactionDescription", "transactionId", "transactionType", "updatedAT" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
