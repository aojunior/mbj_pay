

// export const dbRead = (table) => {
//   try {
//     const query = `SELECT * FROM ${table}`
//     const readQuery = db.prepare(query)
//     const rowList = readQuery.all()
//     return rowList[0]
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }


// export const dbUpdateClient = ({ AccId, Acc, Branch, Status, MedAccId }) => {
//   try {
//     let insertQuery
//     if (Status == 'REGULAR') {
//       insertQuery = db.prepare(
//         `UPDATE client SET Branch = '${Branch}', Account = '${Acc}', Status = '${Status}' WHERE  AccountId = '${AccId}'`
//       )
//     } else {
//       insertQuery = db.prepare(
//         `UPDATE client SET Status = '${Status}' WHERE AccountId = '${AccId}'`
//       )
//     }

//     const insertQuery2 = db.prepare(
//       `REPLACE INTO mediator (MediatorAccountId, MediatorFee) VALUES ('${MedAccId}' , ${0.5})`
//     )

//     const transaction = db.transaction((): any =>{
//       const info = insertQuery.run()
//       const info2 = insertQuery2.run()

//       if (info.lastInsertRowid == 1 && info2.lastInsertRowid == 1) return 'UPDATED'
//     })

//     return transaction()
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }


// export const dbInsertAlias = (data, accountId) => {
//   try {
//     const insertQuery = db.prepare(
//       `REPLACE INTO aliases (AccountId, Alias, Status, Type, CreatedAT) VALUES ( '${accountId}' , @name, @status, @type, '${now[0]}' )`
//     )
//     const transaction = db.transaction((aliases) => {
//       for (const alias of aliases) {
//         if (alias.status == 'CLEARING_REGISTRATION_PENDING') {
//           alias.status = 'PENDING'
//         }
//         insertQuery.run(alias)
//       }
//     })
//     transaction(data)
//     return 200
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }


// export const dbReadAliases = () => {
//   try {
//     const query = `SELECT * FROM aliases`
//     const readQuery = db.prepare(query)
//     const rowList = readQuery.all()
//     return rowList
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }

// export const dbReadActiveAlias = () => {
//   try {
//     const query = `SELECT * FROM aliases WHERE Active = 'True'`
//     const readQuery = db.prepare(query)
//     const rowList = readQuery.all()
//     return rowList[0]
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }

// export const dbInsertTransaction = ({ AccId, TranId, TranType, Status, Amount, Ident }) => {
//   try {
//     const insertQuery = db.prepare(
//       `INSERT INTO transactions (AccountId, TransactionId, TransactionType, Amount, Status, Identify, Date) VALUES ('${AccId}' , '${TranId}', '${TranType}', '${Amount}', '${Status}', '${Ident}', '${now[0]}' )`
//     )

//     const transaction = db.transaction(() => {
//       const info = insertQuery.run()
//       console.log(
//         `Inserted ${info.changes} rows with last ID 
//                  ${info.lastInsertRowid} into cliente`
//       )
//     })
//     transaction()
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }

// export const dbUpdateMediatorFee = (MedAccId, MedFee) => {
//   try {
//     const insertQuery = db.prepare(
//       `Update mediator set MediatorFee = ${MedFee} WHERE MediatorAccountId = '${MedAccId}'`
//     )

//     const transaction = db.transaction(() => {
//       const info = insertQuery.run()
//       console.log(
//         `Add ${info.changes} rows with last ID 
//                  ${info.lastInsertRowid} into Cliente`
//       )
//     })
//     transaction()
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }
