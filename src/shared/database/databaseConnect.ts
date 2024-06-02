import Database from 'better-sqlite3'

const dbPath = "./database.db"
    
export const database = new Database(dbPath, {
        
})

database.pragma("journal_mode = WAL")
