import { PrismaClient } from '@prisma/client';
import { app } from 'electron';
import path from 'node:path';
import fs from 'fs';

const isDev = process.env.NODE_ENV === 'development'

const dbPath = isDev
  ? path.join(__dirname, '../../prisma/dev.db')
  : path.join(app.getPath('userData'), 'database.db');

if (!isDev) {
  try {
    // database file does not exist, need to create
    fs.copyFileSync(
      path.join(process.resourcesPath, 'prisma/dev.db'),
      dbPath,
      fs.constants.COPYFILE_EXCL
    );
    console.log(
      `DB does not exist. Create new DB from ${path.join(
        process.resourcesPath,
        'prisma/dev.db'
      )}`
    );
  } catch (err) {
    if (
      err &&
      'code' in (err as { code: string }) &&
      (err as { code: string }).code !== 'EEXIST'
    ) {
      console.error(`DB creation faild. Reason:`, err);
    } else {
      throw err;
    }
  }
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`, // Defina aqui o caminho para o banco conforme a lógica que você já criou
    },
  },
  log: ['query', 'info', 'warn'], // Para debug
});

