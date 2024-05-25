import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = process.env.NODE_ENV === "development"
        ? "./database.db"
        : join(process.resourcesPath, "./database.db")

export const database = new Database(dbPath, {
        
})

database.pragma("journal_mode = WAL")
