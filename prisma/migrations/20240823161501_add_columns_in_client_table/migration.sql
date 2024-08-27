/*
  Warnings:

  - Added the required column `companyName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashPassword` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saltKey` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "accountId" TEXT NOT NULL,
    "accountHolderId" TEXT NOT NULL,
    "accountBank" TEXT NOT NULL,
    "branchBank" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "saltKey" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("accountBank", "accountHolderId", "accountId", "branchBank", "createdAT", "phoneNumber", "taxId") SELECT "accountBank", "accountHolderId", "accountId", "branchBank", "createdAT", "phoneNumber", "taxId" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_accountId_key" ON "Client"("accountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
