/*
  Warnings:

  - Added the required column `zipCode` to the `Information` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Information" (
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "contry" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAT" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "idDevice" TEXT NOT NULL
);
INSERT INTO "new_Information" ("city", "contry", "createdAT", "idDevice", "ip", "latitude", "longitude", "state", "time") SELECT "city", "contry", "createdAT", "idDevice", "ip", "latitude", "longitude", "state", "time" FROM "Information";
DROP TABLE "Information";
ALTER TABLE "new_Information" RENAME TO "Information";
CREATE UNIQUE INDEX "Information_idDevice_key" ON "Information"("idDevice");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
