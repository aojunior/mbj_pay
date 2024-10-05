/*
  Warnings:

  - You are about to drop the column `accountBank` on the `FavoritesRecipients` table. All the data in the column will be lost.
  - You are about to drop the column `branchBank` on the `FavoritesRecipients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `FavoritesRecipients` table. All the data in the column will be lost.
  - You are about to drop the column `pix` on the `FavoritesRecipients` table. All the data in the column will be lost.
  - The required column `id` was added to the `FavoritesRecipients` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nickname` to the `FavoritesRecipients` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoritesRecipients" (
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
INSERT INTO "new_FavoritesRecipients" ("bankCode", "createdAT", "taxId", "type") SELECT "bankCode", "createdAT", "taxId", "type" FROM "FavoritesRecipients";
DROP TABLE "FavoritesRecipients";
ALTER TABLE "new_FavoritesRecipients" RENAME TO "FavoritesRecipients";
CREATE UNIQUE INDEX "FavoritesRecipients_nickname_key" ON "FavoritesRecipients"("nickname");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
