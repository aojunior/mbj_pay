/*
  Warnings:

  - You are about to drop the `SecurityDevice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SecurityDevice";

-- CreateTable
CREATE TABLE "SecureDevice" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT,
    "type" TEXT,
    "active" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3),

    CONSTRAINT "SecureDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecureDevice_deviceId_key" ON "SecureDevice"("deviceId");
