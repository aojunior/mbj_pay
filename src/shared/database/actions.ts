import { prisma } from './databaseConnect'
import { HashConstructor } from '@shared/utils'

// ACTION TO ACCEPT TERMS OF SERVICES
export async function setDataToTermsOfServiceDB(data) {
  try {
    const info = await prisma.information.findFirst()
    if(info) {
      await prisma.information.delete({
        where: {
          idDevice: info.idDevice
        }
      })
    }

    const save = await prisma.information.create({
      data
    })
    return save
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function getInformationsDB() {
  try {
    const info = await prisma.information.findFirst()
    return info
  } catch (error) {
    console.log(error)
    return null
  }
}

// ACTION TO CLIENT
export async function createClientDB(data: any) {
  try {
    const hash = HashConstructor(data.Pass)
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
      }
    })
    return account
  } catch (error) {
    return error
  }
}

//used in SQLITE
export async function insertExistingClientDB(data: any) {
  try {
    const account = await prisma.client.create({
      data: {
        accountId: data.AccId,
        accountHolderId: data.AccHId,
        accountBank: data.AccBank,
        branchBank: data.Branch,
        companyName: data.Name,
        taxId: data.TaxId,
        phoneNumber: data.Phone,
        email: data.Email,
        hashPassword: data.Pass,
        saltKey: data.Key,
        status: data.Status
      }
    }).then(async (e) => {
      if (e.status === 'REGULAR') {
        await prisma.mediator.create({
          data: {
            mediatorAccountId: data.MedAccId,
            mediatorFee: 1,
            accountId: e.accountId
          }
        })
        return getClientDB(e.accountId)
      } else {
        return e.status
      }
    })
    return account
  } catch (error) {
    console.log(error)
    return
  }
}

export async function updateClientDB(data: any) {
  try {
    await prisma.client.update({
      where: { accountId: data.AccId },
      data: {
        accountBank: data.AccBank,
        branchBank: data.Branch,
        status: data.Status
      }
    }).then(async (e) => {
      const checkMediator = await prisma.mediator.findFirst({
        where: {
          accountId: e.accountId
        }
      })
      if (!checkMediator) {
        const insertMediator = await prisma.mediator.create({
          data: {
            mediatorAccountId: data.MedAccId,
            mediatorFee: 1,
            accountId: e.accountId            
          }
        })
        return insertMediator
      }
    }).catch(err => {
      console.error(err)
      return 'Error updating client'
    })
    return 'UPDATED'
  } catch (error) {
    console.log(error)
    return
  }
}

export async function clientExists() {
  try {
    const account = await prisma.client.findFirst()
    if (account) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return
  }
}

export async function getClientDB(accountId) {
  try {
    const account = await prisma.client.findFirst({
      where: {
        accountId: accountId
      },
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
    return null
  }
}

export async function getClientDB2(accountId) {
  try {
    const account = await prisma.client.findFirst({
      where: { accountId },
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
    return null
  }
}

export async function verifyClientDB(data, accountId: string) {
  try {
    await prisma.aliases.create({
      data: {
        accountId: accountId,
        alias: data.alias,
        status: '',
        active: '',
        type: ''
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteClientDB(accountId: string) { 
  try {
    await prisma.client.delete({
      where: { accountId: accountId }
    })
    return 'DELETED'
  } catch (error) {
    console.error(error)
    return
  }
}

export async function credentialsDB(accountId: string){
  try {
    const credentials = await prisma.client.findFirst({
      where: {
        accountId: accountId
      },
      select: {
        hashPassword: true,
        saltKey: true
      }
    })
    return credentials
  } catch (error) {
    console.error(error)
    return
  }
}

export async function signInDB(data?: string) {
  try {
    const credentials = await prisma.client.findFirst({
      where: { taxId: data },
      select: {
        accountId: true,
        hashPassword: true,
        saltKey: true
      }
    })
    
    return credentials
  } catch (error) {
    console.error(error)
    return
  }
}
 
export async function alterPasswordDB(password, accountId) {
  try {
    const data = HashConstructor(password)
    await prisma.client.update({
      where: {
        accountId: accountId
      },
      data: {
        hashPassword: data.hashPassword,
        saltKey: data.saltKey
      }
    })
    return 'CHANGED'
  } catch (error) {
    console.error(error)
    return
  }
}
// ----------------------------------------------------------------

// ACTION TO ALIASES
export async function createAliasDB(data, accountId: string) {
  try {
    if (data.status == 'CLEARING_REGISTRATION_PENDING') {
      data.status = 'PENDING'
    }
    const alias = await prisma.aliases.create({
      data: {
        accountId: accountId,
        alias: data.name,
        status: data.status,
        active: '',
        type: data.type
      }
    })
    return alias
  } catch (error) {
    console.error(error)
    return
  }
}

export async function deleteAliasDB(alias: string, accountId: string) {
  try {
    const del = await prisma.aliases
      .deleteMany({
        where: {
          AND: [
            {
              accountId: accountId
            },
            {
              alias: alias
            } 
          ]
        }
      })
    return del
  } catch (error) {
    console.error(error)
    return
  }
}

export async function updateAliasDB(data: any) {
  try {
    await prisma.aliases.update({
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
    await prisma.aliases
      .updateMany({
        where: {
          accountId: accountId
        },
        data: {
          active: ''
        }
      })
      .then(async () => {
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

export async function getAliasesDB(accountId: string) {
  const aliasesAll = await prisma.aliases.findMany({
    where: {  
      accountId
    }
  })
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

// ACTION TO TRANSACTION
export async function createTransanctionDB(data) {
  try {
    const transaction = await prisma.transactions.create({
      data: {
        accountId: data.accId,
        amount: data.totalAmount,
        transactionId: data.transactionId,
        transactionType: data.transactionType,
        status: data.status,
        transactionDescription: data.description,
        identify: data.identify // nro pedido sistema
      }
    })
    return transaction
  } catch (error) {
    console.error(error)
  }
}

export async function updateTransanctionDB(data) {
  try {
    const update = await prisma.transactions.update({
      where: {
        id: data.id
      },
      data
    })

    return update
  } catch (error) {
    console.error(error)
  }
}

export async function getTransanctionDB(transactionId) {
  try{
    const transaction = await prisma.transactions.findFirst({
      where: {
        transactionId: transactionId
      }
    })
    return transaction
  } catch(error) {

  }
}

export async function deleteTransanctionDB() {

}
// ----------------------------------------------------------------

// ACTION TO Favorite Bank
export async function createfavoriteRecipientDB(data: any) {
  try {
    const favorite = await prisma.favoritesRecipients.create({
      data: data
    })
    return favorite
  } catch (error) {
    console.error(error)
    return
  }
}

export async function updatefavoriteRecipientDB(data: any) {
  try {
    const favorite = await prisma.favoritesRecipients.updateMany({
      where:{
        AND: [
          { 
           id: data.id,
          },
          {
            accountId: data.accountId,
          }
        ]
      },
      data: data
    })
    return favorite
  } catch (error) {
    console.error(error)
    return
  }
}

export async function getFavoriteRecipientDB(accountId: string) {
  try {
    const data = await prisma.favoritesRecipients.findMany({
      where: {
        accountId: accountId
      }
    })
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getFavoriteRecipientOnIdDB(id: string, accountId: string) {
  try {
    const data = await prisma.favoritesRecipients.findFirst({
      where: {
        AND: [
          { id: id }, { accountId: accountId }
        ]
      }
    })
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function deleteFavoriteRecipientDB(id: string, accountId: string) {
  const del = await prisma.favoritesRecipients.deleteMany({
    where: {
      AND: [
        { id: id }, { accountId: accountId }
      ]
    }
  })
  return del
}
// ----------------------------------------------------------------

// ACTION TO Mediator
export async function getMediatorDB(accountId) {
  const mediator = await prisma.mediator.findFirst({
    where: {
      accountId: accountId
    }
  })
  return mediator
}