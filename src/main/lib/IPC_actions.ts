import os from 'node:os'
import { machineIdSync } from 'node-machine-id'
import { createAliasDB, deleteAliasDB, getAliasesDB, getClientDB, updateAliasDB, updateClientDB } from "@shared/database/actions"
import { currentTime, delay } from "@shared/utils"
import { createAliasesAPIV1, getLocationAndIPV6V1, VerifyAccountAPIV1, verifyAliasesAPIV1 } from '@shared/apiV1'
import { handleMessageError } from '@shared/handleErrors'

export async function getInformationsFromMachine() {
  const fetch = await getLocationAndIPV6V1()
  function getIPs() {
    let ifaces: any = os.networkInterfaces()
    let ipAdresse: any = {}
    Object.keys(ifaces).forEach(function (ifname) {
      let alias = 0
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          // console.log(ifname + ':' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          // console.log(ifname, iface.address);
          ipAdresse = { IP: iface.address, MAC: iface.mac }
        }
        ++alias
      })
    })
    return ipAdresse.IP
  }
  let ipNet = getIPs()
  let idDevice = machineIdSync(true)

  const infos = {
    time: currentTime,
    createdAT: new Date(),
    latitude: fetch.latitude,
    longitude: fetch.longitude,
    zipCode: fetch.zip_code,
    city: fetch.city,
    state: fetch.region_name,
    country: fetch.country_name,
    // ipv6: fetch.ip,
    ip: ipNet,
    idDevice: idDevice
  }
  return infos
}

export async function verify_account(token: string | null, accountId: string) {
  let consulta = await VerifyAccountAPIV1(token, accountId)
  if (consulta?.message === 'success') {
    let data = {
      AccId: consulta?.data.account.accountId,
      AccBank: consulta?.data.account.account,
      Branch: consulta?.data.account.branch,
      Status: consulta?.data.accountStatus,
      MedAccId: consulta?.data.mediatorId
    }
    let update = await updateClientDB(data)
    return { data: await getClientDB(accountId), update: update}
  } else {
    return handleMessageError(consulta?.message)
  }
}

export async function create_alias(token: string, accountId: string) {
  try {
    let aliases = await getAliasesDB(accountId)
    if(aliases.length >= 20) return // Not Create alias if exist more than one or if have error
    const createAlias = await createAliasesAPIV1(token, accountId)
    if (createAlias.data.alias.status === 'CLEARING_REGISTRATION_PENDING') {
      aliases = await verifyAndUpdateAliases(token, accountId)
      // Get all, filter and add new alias in the db
      // const verify = await verifyAliasesAPIV1(token, accountId)
      // const filteredArrayAdd = verify?.data.aliases.filter((aliasAPI) => {
      //   const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
      //   return !matchingItem
      // })
      // filteredArrayAdd.map(async (alias) => {
      //   await createAliasDB(alias, String(accountId))
      // })
      // aliases = await getAliasesDB()
      return {aliases, message: 'CREATED'}
    } else {
      return handleMessageError(createAlias.message)
    }
  } catch(err) {
    return {aliases: null, message: 'ERROR'}
  }
}

export async function verifyAndUpdateAliases(token: string, accountId: string){
  try {
    const aliases = await getAliasesDB(accountId)
    let verify = await verifyAliasesAPIV1(token, accountId)
    if(verify?.message !== 'success') {
      return handleMessageError(verify?.message)
    } else {
      if(verify.data.aliases.length == 0) return {data: await getAliasesDB(accountId), message: 'SUCCESS'}
      const filteredArrayAdd = verify.data.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
        return !matchingItem
      })
    
      if (filteredArrayAdd.length > 0) {
        filteredArrayAdd.map(async (alias) => {
          await createAliasDB(alias, accountId)
        })
      }
    
      const filteredArrayUpdate = verify.data.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
        return matchingItem && matchingItem.status !== aliasAPI.status
      })
    
      if (filteredArrayUpdate.length > 0) {
        filteredArrayUpdate.map(async (alias) => {
          await updateAliasDB(alias)
        })
      }
      
      const filteredArrayDelete = aliases.filter((aliasDB) => {
        const matchingItem = verify.data.aliases.find((aliasAPI) => aliasAPI.name === aliasDB.alias)
        return !matchingItem
      })
    
      if (filteredArrayDelete.length > 0) {
        filteredArrayDelete.map(async (alias) => {
          await deleteAliasDB(alias.alias, accountId)
        })
      }
      await delay(3000)
      return {data: await getAliasesDB(accountId), message: 'SUCCESS'}
    }
  } catch(err) {
    return {data: [], message: 'ERROR'}
  }
}