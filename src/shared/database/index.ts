import { database  } from "./databaseConnect";

const db = database

export const dbCreate = () => {
    try {
        const insertQuery = db.prepare(
            `CREATE TABLE IF NOT EXISTS cliente (Aliases VARCHAR(50), AccountId VARCHAR(50), AccountHolderId VARCHAR(50), Cnpj VARCHAR(12), Telefone VARCHAR(12)) `
        )

        const transaction = db.transaction(() => {
            const info = insertQuery.run()
            console.log(
                `Inserted ${info.changes} rows with last ID 
                 ${info.lastInsertRowid} into cliente`
            )
        })
        transaction()
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbRead = () => {
    try {
        const query = `SELECT * FROM cliente`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        return rowList[0]
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbInsert = ({AccId, AccHID, Cnpj, Tel}) => {
    try {
        const insertQuery = db.prepare(
            `INSERT INTO cliente (AccountId, AccountHolderId, Cnpj, Telefone) VALUES ('${AccId}' , '${AccHID}', '${Cnpj}', '${Tel}') LIMIT 1`
        )

        const transaction = db.transaction(() => {
            const info = insertQuery.run()
            console.log(
                `Inserted ${info.changes} rows with last ID 
                 ${info.lastInsertRowid} into cliente`
            )
        })
        transaction()
        console.log('Created')
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbAlter = (aliases) => {
    try {
        const insertQuery = db.prepare(
            `Update cliente set Aliases = '${aliases}'`
        )

        const transaction = db.transaction(() => {
            const info = insertQuery.run()
            console.log(
                `Add ${info.changes} rows with last ID 
                 ${info.lastInsertRowid} into Cliente`
            )
        })
        transaction()
    } catch (err) {
        console.error(err)
        throw err
    }
}