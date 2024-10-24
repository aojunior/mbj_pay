import { appDirectoryFile, fileEncoding } from '@shared/constants'
import { HashComparator, HashConstructor } from '@shared/utils'
import { readFile, unwatchFile, watchFile, writeFile, unlink } from 'fs'
import { ensureDir, existsSync, mkdir } from 'fs-extra'
import { promisify } from 'util';

import { join } from 'path'

// UTILS FUNCTIONS
export const getRootDirectory = () => {
  return `${appDirectoryFile}`
}
export const createPath = () => {
  const rootDir = getRootDirectory()
  const ReqPath = rootDir + '/Req'
  const ResPath = rootDir + '/Res'
  const PrintPath = rootDir + '/Print'

  if (
    !existsSync(rootDir) ||
    !existsSync(ReqPath) ||
    !existsSync(ResPath) ||
    !existsSync(PrintPath)
  ) {
    console.log(`Creating path ...`)
    Promise.all([mkdir(rootDir), mkdir(ReqPath), mkdir(ResPath), mkdir(PrintPath)])
      .then(() => console.log(`Succssesfull `))
      .catch((err) => console.error('Error: ', err))
  }
}
export const removeReqFile = async () => {
  const rootDir = getRootDirectory()
  await ensureDir(rootDir)
  const ReqFile = rootDir + '/Req/001.int'
  if(existsSync(ReqFile)) {
    await unlink(ReqFile, (err) => {
      if (err) throw err
      console.log(`Remove file Succssesfull `)
    })
  }
}
export const removeResFile = async () => {
  const rootDir = getRootDirectory()
  await ensureDir(rootDir)
  const ReqFile = rootDir + '/Res/001.pos'
  if(existsSync(ReqFile)) {
    await unlink(ReqFile, (err) => {
      if (err) throw err
      console.log(`Remove file Succssesfull `)
    })
  }
}
// ----------------------------------------------------------------

// CORE FUNCTIONS
export const watchFileAndFormat = async (callback: (formatData: any) => void) => {
  const rootDir = getRootDirectory()
  await ensureDir(rootDir)
  const ReqFile = rootDir + '/Req/001.int'

  await watchFile(ReqFile, async (curr) => {
    // console.log(`Read File: ${curr.isFile()}`);
    if (curr.isFile()) {
      await readFile(ReqFile, fileEncoding, (err, data) => {
        if (err) throw err
        const linesUnformatted = data.split('\n')
        // if send order correctly
        const line0 = linesUnformatted[0].split('=') // type file
        const line1 = linesUnformatted[1].split('=') // order id
        const line2 = linesUnformatted[2].split('=') // total amount
        const line3 = linesUnformatted[3].split('=') // customer id
        const line4 = linesUnformatted[4].split('=') // comments
        const line5 = linesUnformatted[5] //file end
        const filePath = {
          fileType: line0[1].trim(),
          orderID: line1[1].trim(),
          totalAmount: line2[1].trim(),
          customerID: line3[1].trim(),
          recipientComment: line4[1].trim(),
          filEnd: line5
        }
        if (filePath.fileType === '1') {
          return callback(filePath)
        }

        if (filePath.fileType === '0') {
          return callback(null)
        }
      })
    } else {
      return callback(null)
    }
  })

  return () => {
    unwatchFile(ReqFile)
    // watcher.close();
  }
}

type propsReqFile = {
  orderID: string,
  totalAmount: string,
  customerID: string,
  recipientComment: string
}
export const createReqFile = async (data: propsReqFile) => {
  const rootDir = getRootDirectory()
  await ensureDir(rootDir)
  const ResFile = rootDir + '/Req/001.int'
  const contentInFile = `000 = 1 \n 001 = ${data.orderID} \n 002 = ${data.totalAmount} \n 003 = ${data.customerID} \n 004 = ${data.recipientComment} \n 999`

  await writeFile(ResFile, contentInFile, (err) => {
    if (err) throw err
    console.log(`Create REQ file Succssesfull `)
    return `Create REQ file Succssesfull `
  })
}

export const createResFile = async (status: string) => {
  const rootDir = getRootDirectory()
  await ensureDir(rootDir)
  const ResFile = rootDir + '/Res/001.pos'
  let contentInFile;

  switch (status) {
    case 'APPROVED':
      contentInFile = '000 = 1\n001=Pagamento Aprovado\n999'
      break
    case 'CANCELING':
    
      break
    case 'CANCELED':
      contentInFile = '000 = 0\n001=OPERACAO CANCELADA\n999'
      break
    case 'AUTHORIZED':
      
      break
    case 'CAPTURED':
      
      break
    case 'OVERFILLED':
      
      break
    case 'FATAL_ERROR':
      
      break
    case 'REJECTED':
      
      break
    case 'EXPIRED':
      
      break
    case 'PARTIAL':
      
      break
    case 'UNFINISHED':
      
      break
    case 'ERROR':
      
      break
    default:
      return
  }

  await writeFile(ResFile, contentInFile, (err) => {
    if (err) throw err
    console.log(`Create Res file Succssesfull `)
  })
}

// ----------------------------------------------------------------

// FILES ENCRIPT SIGN IN
type props = {
  ktax: string  // saltKey
  dataT: string // taxId
  kpass: string // saltKey
  dataP: string // password
  accID: string
}
export const encriptoFile = async ({Cnpj, Pass, Account}) => {
  const pathFile = join(__dirname, '../encript.pos')
  const TaxID = await HashConstructor(Cnpj)
  const Password = await HashConstructor(Pass)
  const dataEncript: props = {
    ktax: TaxID.saltKey,
    dataT: TaxID.hashPassword,
    kpass: Password.saltKey,
    dataP: Password.hashPassword,
    accID: Account
  }
  await writeFile(pathFile, JSON.stringify(dataEncript), (err) => {
    if (err) throw err
    console.log(`Encript file Succssesfull `)
  })
}
const readFileAsync = promisify(readFile);
export const readEncriptoFile = async ({taxId, password}) => {
  try {
    const pathFile = join(__dirname, '../encript.pos')
    if(!existsSync(pathFile)) {
      console.log('File no exist')
      return
    }
    const data = await readFileAsync(pathFile, fileEncoding)
    const parse = JSON.parse(data);
    let txHash = {
      saltKey: parse.ktax,
      hashPassword: parse.dataT
    }
    let passHash = {
      saltKey: parse.kpass,
      hashPassword: parse.dataP
    }
    const verifyT = await HashComparator(taxId, txHash)
    const verifyP = await HashComparator(password, passHash)
    
    if(!verifyT || !verifyP) return null

    return {
      account: parse.accID,
      saltKey: parse.kpass,
      hashPassword: parse.dataP
    }
  } catch(err) {
    console.log(err)
  }
}

export const encriptoTest = async ({Cnpj, Pass, Account}) => {
  const pathFile = join(__dirname, '../teste.pos')
  const TaxID = await HashConstructor(Cnpj)
  const Password = await HashConstructor(Pass)
  const dataEncript: props = {
    ktax: TaxID.saltKey,
    dataT: TaxID.hashPassword,
    kpass: Password.saltKey,
    dataP: Password.hashPassword,
    accID: Account
  }
  await writeFile(pathFile, JSON.stringify(dataEncript), (err) => {
    if (err) throw err
    console.log(`Encript file Succssesfull `)
  })
}
