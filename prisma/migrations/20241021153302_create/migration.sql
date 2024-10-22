/*
  Warnings:

  - You are about to drop the `Information` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Information" DROP CONSTRAINT "Information_accountId_fkey";

-- DropTable
DROP TABLE "Information";

-- CreateTable
CREATE TABLE "Informations" (
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
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SecurityDevice" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT,
    "type" TEXT,
    "active" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3),

    CONSTRAINT "SecurityDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "email" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sms" TEXT,
    "push" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "Informations_deviceId_key" ON "Informations"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityDevice_deviceId_key" ON "SecurityDevice"("deviceId");

-- AddForeignKey
ALTER TABLE "Informations" ADD CONSTRAINT "Informations_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;
