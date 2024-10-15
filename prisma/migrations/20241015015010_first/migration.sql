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
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Information" (
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "idDevice" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Aliases" (
    "alias" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "active" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "identify" TEXT,
    "transactionDescription" TEXT,
    "message" TEXT,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3),

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritesRecipients" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "pixKey" TEXT,
    "bankAgency" TEXT,
    "bankAccount" TEXT,
    "bankBranch" TEXT,
    "bankCode" TEXT,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritesRecipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mediator" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "mediatorAccountId" TEXT NOT NULL,
    "mediatorFee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Mediator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_accountId_key" ON "Client"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Information_accountId_key" ON "Information"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Information_idDevice_key" ON "Information"("idDevice");

-- CreateIndex
CREATE UNIQUE INDEX "Aliases_alias_key" ON "Aliases"("alias");

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aliases" ADD CONSTRAINT "Aliases_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesRecipients" ADD CONSTRAINT "FavoritesRecipients_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mediator" ADD CONSTRAINT "Mediator_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;
