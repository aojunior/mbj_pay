import { database  } from "./databaseConnect";

const db = database
const dt = new Date().toISOString()
const now = dt.split('T')

export const dbCreate = () => {
    try {
        const createTbls = {
            client: db.prepare(`CREATE TABLE IF NOT EXISTS client (AccountId VARCHAR(50), AccountHolderId VARCHAR(50), Account VARCHAR(50), Branch VARCHAR(50), Cnpj VARCHAR(12), Phone VARCHAR(12), Date DateTime, Status VARCHAR(12) )`),
            aliases: db.prepare(`CREATE TABLE IF NOT EXISTS aliases (AccountId VARCHAR(50), Alias VARCHAR(50), Date DateTime, Status VARCHAR(12), Active VARCHAR(5))`),
            transactions: db.prepare(`CREATE TABLE IF NOT EXISTS transactions (AccountId VARCHAR(50), TransactionId VARCHAR(50), TransactionType VARCHAR(50), Amount VARCHAR(50), Status VARCHAR(50), Identify VARCHAR(40), Date DateTime)`),
            mediator: db.prepare(`CREATE TABLE IF NOT EXISTS mediator (MediatorAccountId VARCHAR(50), MediatorFee Float)`)
        }
        const transaction = db.transaction(() => {
            createTbls.client.run()
            createTbls.aliases.run()
            createTbls.mediator.run()
            createTbls.transactions.run()
            console.log(
                `Tables create`
            )
        })
        transaction()
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbRead = (table) => {
    try {
        const query = `SELECT * FROM ${table}`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        return rowList[0]
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbInsertClient = ({AccId, AccHID, Cnpj, Tel, Status}) => {
    try {
        const insertQuery = db.prepare(
            `INSERT INTO client (AccountId, AccountHolderId, Cnpj, Phone, Status, Date) VALUES ('${AccId}' , '${AccHID}', '${Cnpj}', '${Tel}', '${Status}', '${now[0]}')`
        )
        const transaction = db.transaction(() => {
            const info = insertQuery.run()
            return info.lastInsertRowid
        })

        return transaction()
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbUpdateClient = ({AccId, Acc, Branch, Status, MedAccId}) => {
    try {
        let insertQuery
        if(Status == 'REGULAR') {
            insertQuery = db.prepare(
                `UPDATE client SET Branch = '${Branch}', Account = '${Acc}', Status = '${Status}' WHERE  AccountId = '${AccId}'`
            )
        } else {
            insertQuery = db.prepare(
                `UPDATE client SET Status = '${Status}' WHERE AccountId = '${AccId}'`
            )
        }
        
        const insertQuery2 = db.prepare(
            `REPLACE INTO mediator (MediatorAccountId, MediatorFee) VALUES ('${MedAccId}' , ${0.50})`
        )
        const transaction = db.transaction(() => {
            const info = insertQuery.run()
            const info2 = insertQuery2.run()

            if(info.lastInsertRowid == 1 && info2.lastInsertRowid == 1)
                return 'UPDATED'
        })

        return transaction()
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbClientExists = () => {
    try {
        const query = `SELECT * FROM client`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        if(rowList[0]) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbInsertAlias = (data) => {
    try {
        const insertQuery = db.prepare(
            `INSERT IGNORE INTO alias (AccountId, Alias, Status, Date) VALUES ( @AccountId , @Alias, @Status, '${now[0]}') LIMIT 1`
        )
        const transaction = db.transaction((aliases) => {
            for(const alias of aliases) insertQuery.run(alias)
        })
        transaction(data)

        console.log('Insert Aliases')
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbActiveAlias = (Alias) => {
    try {
        const desactiveAll = db.prepare(
            `Update alias set Active = ''`
        );
        const active = db.prepare(
            `Update alias set Active = 'True' WHERE Alias = '${Alias}'`
        );

        const transaction = db.transaction(() => {
            const info = desactiveAll.run()
            console.log(
                `Add ${info.changes} rows with last ID 
                 ${info.lastInsertRowid} into Cliente`
            )

            const info2 = active.run()
            console.log(
                `Add ${info2.changes} rows with last ID 
                 ${info2.lastInsertRowid} into Cliente`
            )
        })
        transaction()
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbUpdateAlias = (Alias, Status) => {
    try {
        const insertQuery = db.prepare(
            `Update alias SET Status = '${Status}' WHERE Alias = '${Alias}'`
        );

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

export const dbReadActiveAlias = () => {
    try {
        const query = `SELECT * FROM alias WHERE Active = 'True'`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        return rowList[0]
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dbInsertTransaction = ({AccId, TranId, TranType, Status, Amount, Ident}) => {
    try {
        const insertQuery = db.prepare(
            `INSERT INTO transactions (AccountId, TransactionId, TransactionType, Amount, Status, Identify, Date) VALUES ('${AccId}' , '${TranId}', '${TranType}', '${Amount}', '${Status}', '${Ident}', '${now[0]}' )`
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

export const dbUpdateMediatorFee = (MedAccId, MedFee) => {
    try {
        const insertQuery = db.prepare(
            `Update mediator set MediatorFee = ${MedFee} WHERE MediatorAccountId = '${MedAccId}'`
        );

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