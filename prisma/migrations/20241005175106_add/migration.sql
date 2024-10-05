-- CreateTable
CREATE TABLE "FavoritesRecipients" (
    "pix" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountBank" TEXT,
    "branchBank" TEXT,
    "bankCode" TEXT,
    "type" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "accountId" TEXT NOT NULL,
    "accountHolderId" TEXT NOT NULL,
    "accountBank" INTEGER,
    "branchBank" INTEGER,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "FavoritesRecipients_pix_key" ON "FavoritesRecipients"("pix");
