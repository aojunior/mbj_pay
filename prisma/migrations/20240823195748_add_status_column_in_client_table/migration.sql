/*
  Warnings:

  - Added the required column `status` to the `Client` table without a default value. This is not possible if the table is not empty.

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
    "phoneNumber" TEXT NOT NULL,
    "saltKey" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("accountBank", "accountHolderId", "accountId", "branchBank", "companyName", "createdAT", "email", "hashPassword", "phoneNumber", "saltKey", "taxId") SELECT "accountBank", "accountHolderId", "accountId", "branchBank", "companyName", "createdAT", "email", "hashPassword", "phoneNumber", "saltKey", "taxId" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_accountId_key" ON "Client"("accountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
