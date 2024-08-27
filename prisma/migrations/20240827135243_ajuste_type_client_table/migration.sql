/*
  Warnings:

  - You are about to alter the column `accountBank` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `branchBank` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "accountId" TEXT NOT NULL,
    "accountHolderId" TEXT NOT NULL,
    "accountBank" INTEGER NOT NULL,
    "branchBank" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "saltKey" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("accountBank", "accountHolderId", "accountId", "branchBank", "companyName", "createdAT", "email", "hashPassword", "phoneNumber", "saltKey", "status", "taxId") SELECT "accountBank", "accountHolderId", "accountId", "branchBank", "companyName", "createdAT", "email", "hashPassword", "phoneNumber", "saltKey", "status", "taxId" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_accountId_key" ON "Client"("accountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
