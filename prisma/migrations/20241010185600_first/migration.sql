-- CreateTable
CREATE TABLE "Client" (
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

-- CreateTable
CREATE TABLE "Information" (
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "contry" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "idDevice" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Aliases" (
    "alias" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "active" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aliases_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client" ("accountId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transactions" (
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

-- CreateTable
CREATE TABLE "FavoritesRecipients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "pixKey" TEXT,
    "bankAgency" TEXT,
    "bankAccount" TEXT,
    "bankBranch" TEXT,
    "bankCode" TEXT,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Mediator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediatorAccountId" TEXT NOT NULL,
    "mediatorFee" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_accountId_key" ON "Client"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Information_idDevice_key" ON "Information"("idDevice");

-- CreateIndex
CREATE UNIQUE INDEX "Aliases_alias_key" ON "Aliases"("alias");
