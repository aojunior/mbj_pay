import { Aliases } from '@prisma/client';
import { prisma } from './databaseConnect';
import { HashConstructor } from '../utils';

// ACTION TO CLIENT
export async function createClientDB(data: any) {
  try {
    const hash = HashConstructor(data.password)
    const account = await prisma.client.create({
      data: {
        accountId: data.AccId,
        accountHolderId: data.AccHId,
        accountBank: 0,
        branchBank: 0,
        companyName: data.Nome,
        taxId: data.Cnpj,
        phoneNumber: data.Tel,
        email: data.Email,
        hashPassword: hash.hashPassword, 
        saltKey: hash.saltKey,
        status: data.Status
      },
    })
    return account
  } catch (error) {
    console.log(error)
  }
}

export async function updateClientDB(data: any) {
  try {
    const upsert = await prisma.client.update({
      where: { accountId: data.AccId },
      data: {
        accountBank: data.AccBank,
        branchBank: data.Branch,
        status: data.Status,
      },
    }).then( async e => {
      if(e.status === 'REGULAR') {
        const insertMediator = await prisma.mediator.create({
          data: {
            MediatorAccountId: data.MedAccId,
            MediatroFee: 0.5
          }
        })
        return insertMediator
      } else {
        return e.status
      }
    })
    return 'UPDATED'
  } catch (error) {
    console.log(error)
  }
}

export async function clientExists() {
  try {
    const account = await prisma.client.findFirstOrThrow()
    if (account) {
      return true
    } else {
      return false
    }    
  } catch (error) {
    console.error(error)
  }
}

export async function getClientDB() {
  try {
    const account = await prisma.client.findFirst({
      select: {
        accountId: true,
        accountBank: true,
        branchBank: true,
        accountHolderId: true,
        companyName: true,
        createdAT: true,
        email: true,
        phoneNumber: true,
        taxId: true,
        status: true,
        hashPassword: false,
        saltKey: false
      }
    })
    return account
  } catch (error) {
    console.error(error) 
  }
}

export async function verifyClientDB(data, accountId: string) {
  try {
    const aliases = await prisma.aliases.create({
      data: {
        accountId: accountId,
        alias: data.alias,
        status: '',
        active: '',
        type: '',
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteClientDB(accountId: string)  {
  try {
    const del = await prisma.client.delete({
      where: { accountId: accountId },
    })    
    return 'DELETED'
  } catch (error) {
    console.error(error)
  }
}

export async function credentials() {
  try {
    const credentials = await prisma.client.findFirst({
      select: {
        hashPassword: true,
        saltKey: true
      }
    })
    return credentials
  } catch (error) {
    console.error(error) 
  }
}
// ----------------------------------------------------------------

// ACTION TO ALIASES
export async function createAliasDB(data, accountId: string) {
  try {
    if(data.status == 'CLEARING_REGISTRATION_PENDING') {
      data.status = 'PENDING'
    }
    const alias = await prisma.aliases.create({
      data: {
        accountId: accountId,
        alias: data.name,
        status: data.status,
        active: '',
        type: data.type,
      }
    })
    return alias
  } catch (error) {
    console.error(error)
  }
}

export async function deleteAliasDB(alias: string, accountId: string) {
  try {
    const del = await prisma.aliases.deleteMany({
      where: {
        AND: [
          {
            accountId: accountId,
          },
          {
            alias: alias
          }
        ]
      },
    }).then(async () => {
      return await prisma.aliases.findMany()
    })
    return del
  } catch (error) {
    console.error(error)
  }
}

export async function updateAliasDB(data: any, accountId: string) {
  try {
    const upsert = await prisma.aliases.update({
      where: {
        alias: data.alias
      },
      data: {
        status: data.status
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function activeAliasDB(alias: string, accountId: string) {
  try {
    const disableAll = await prisma.aliases.updateMany({
      where: {
        accountId: accountId
      },
      data: {
        active: ''
      }
    }).then(async () => {
      return await prisma.aliases.update({
        where: {
          alias: alias
        },
        data: {
          active: 'true'
        }
    })
  })
  } catch (error) {
    console.log(error) 
  }
}

export async function readAliasesDB() {
  const aliasesAll = await prisma.aliases.findMany()

  return aliasesAll
}

export async function readAliasesActiveDB() {
  const aliasesAll = await prisma.aliases.findFirst({
    where: {
      alias: 'alias'
    }
  })

  return aliasesAll
}
// ----------------------------------------------------------------

