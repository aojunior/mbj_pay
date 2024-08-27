// import Database from 'better-sqlite3'
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient()

const dbPath = './database.db'

// export const database = new Database(dbPath, {})

// database.pragma('journal_mode = WAL')
