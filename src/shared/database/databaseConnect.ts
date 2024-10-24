require('dotenv').config();
import { PrismaClient } from '@prisma/client';

// const dbPath = isDev
//   ? path.join(__dirname, '../../prisma/dev.db')
//   : path.join(process.resourcesPath, 'database.db');

// if (!isDev) {
//   try {
//     // database file does not exist, need to create
//     if(!fs.existsSync(dbPath)) {
//       process.env.DATABASE_URL = dbPath;
//       fs.copyFileSync(
//         path.join(process.resourcesPath, 'prisma/dev.db'),
//         dbPath,
//         fs.constants.COPYFILE_EXCL
//       );
//       console.log(
//         `DB does not exist. Create new DB from ${path.join(
//           process.resourcesPath,
//           'prisma/dev.db'
//         )}`
//       ); 
//     }
//   } catch (err) {
//     if (
//       err &&
//       'code' in (err as { code: string }) &&
//       (err as { code: string }).code !== 'EEXIST'
//     ) {
//       console.error(`DB creation faild. Reason:`, err);
//     } else {
//       throw err;
//     }
//   }
// }

// export const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: `file:${dbPath}`, // Defina aqui o caminho para o banco conforme a lógica que você já criou
//     },
//   },
//   log: ['info', 'warn'], // Para debug
// });


export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'], // Para debug
});