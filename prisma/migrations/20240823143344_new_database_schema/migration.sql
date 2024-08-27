-- CreateTable
CREATE TABLE "Client" (
    "accountId" TEXT NOT NULL,
    "accountHolderId" TEXT NOT NULL,
    "accountBank" TEXT NOT NULL,
    "branchBank" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    "TransactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "Amount" REAL NOT NULL,
    "identify" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client" ("accountId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mediator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "MediatorAccountId" TEXT NOT NULL,
    "MediatroFee" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_accountId_key" ON "Client"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Aliases_alias_key" ON "Aliases"("alias");
