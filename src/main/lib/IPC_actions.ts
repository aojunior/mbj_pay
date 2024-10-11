import os from 'node:os'
import { machineIdSync } from 'node-machine-id'
import { createAliasesAPI, getLocationAndIPV6, VerifyAccountAPI, verifyAliasesAPI } from "@shared/api"
import { createAliasDB, deleteAliasDB, getAliasesDB, getClientDB, setDataToTermsOfService, updateAliasDB, updateClientDB } from "@shared/database/actions"
import { currentTime, delay } from "@shared/utils"
// import logger from '@shared/logger'

export async function getInformationsFromMachine() {
    const fetch = await getLocationAndIPV6()
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
      contry: fetch.country_name,
      // ipv6: fetch.ip,
      ip: ipNet,
      idDevice: idDevice
    }
    const saveInDB = await setDataToTermsOfService(infos)
    return saveInDB
}

export async function verify_account(token: string | null, client: any) {
  let consulta = await VerifyAccountAPI(token, client?.accountId)
  if (consulta.error) return 'Error'

  let data = {
    AccId: consulta.account.accountId,
    AccBank: consulta.account.account,
    Branch: consulta.account.branch,
    Status: consulta.accountStatus,
    MedAccId: consulta.mediatorId
  }
  if (data.Status !== client?.status) {
    let update = await updateClientDB(data)
    return update
  } else {
    return 'RELOADED'
  }
}

export async function create_alias(token: string, accountId: string, status?: string) {
  try {
    let aliases = await getAliasesDB()
    if(aliases.length > 0 || status !== 'REGULAR') return // Not Create alias if exist more than one or if have error
  
    const createAlias = await createAliasesAPI(token, accountId)
    if (createAlias.alias.status === 'CLEARING_REGISTRATION_PENDING') {
      await delay(3000) 
      // Get all, filter and add new alias in the db
      const verify = await verifyAliasesAPI(token, accountId)
      const filteredArrayAdd = verify.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
        return !matchingItem
      })
      filteredArrayAdd.map(async (alias) => {
        await createAliasDB(alias, String(accountId))
      })
      aliases = await getAliasesDB()
      return {aliases, message: 'CREATED'}
    } else {
      return {aliases: null, message: 'ERROR'}
    }
  } catch(err) {
    return {aliases: null, message: 'ERROR'}
  }
}

export async function verifyAndUpdateAliases(token: string) {
  try {
    const client = await getClientDB()
    const aliases = await getAliasesDB()
    let verify = await verifyAliasesAPI(token, String(client?.accountId))
  
    if(!verify.aliases) {
      if(verify == 503) {
        return {data: null, message: 'NETWORK_ERROR'}
      } else {
        return {data: null, message: 'GENERIC_ERROR'}
      }
    } else {
      const filteredArrayAdd = verify.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
        return !matchingItem
      })
    
      if (filteredArrayAdd.length > 0) {
        filteredArrayAdd.map(async (alias) => {
          await createAliasDB(alias, String(client?.accountId))
        })
      }
    
      const filteredArrayUpdate = verify.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
        return matchingItem && matchingItem.status !== aliasAPI.status
      })
    
      if (filteredArrayUpdate.length > 0) {
        filteredArrayUpdate.map(async (alias) => {
          await updateAliasDB(alias)
        })
      }
      
      const filteredArrayDelete = aliases.filter((aliasDB) => {
        const matchingItem = verify.aliases.find((aliasAPI) => aliasAPI.name === aliasDB.alias)
        return !matchingItem
      })
    
      if (filteredArrayDelete.length > 0) {
        filteredArrayDelete.map(async (alias) => {
          await deleteAliasDB(alias.alias, String(client?.accountId))
        })
      }
  
      return{data: await getAliasesDB(), message: 'SUCCESS'}
    }
  } catch(err) {
    return
  }
}