import { createHmac } from 'crypto'
import axios from 'axios'
import https from 'https'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync } from 'fs'
import { z } from 'zod'
import { accountSchema } from './schemas'
import { getClientDB } from './database/actions'

const now = new Date().toISOString()
const client_id = import.meta.env.MAIN_VITE_CLIENTEID
const client_secret = import.meta.env.MAIN_VITE_CLIENTSECRET
const SecretKey = import.meta.env.MAIN_VITE_SECRETKEY
const certificate_pem = readFileSync(join(__dirname, '../') + 'CERTIFICATES/client.crt')
const certificate_key = readFileSync(join(__dirname, '../') + 'CERTIFICATES/client.key')
const certificate_ca = readFileSync(join(__dirname, '../') + 'CERTIFICATES/rootCA.crt')

const headers = {
  'Accept-Encoding': 'gzip, deflate, br',
  connection: 'keep-alive',
  Accept: '*/*',
  'Content-Type': 'application/json',

  Host: 'mtls-mp.hml.flagship.maas.link'
}

async function encrypt_string(hash_string: string) {
  const msg = hash_string
  const key = SecretKey
  const hmac = createHmac('sha256', key)
  hmac.update(msg)
  const sha_signature = hmac.digest('hex')
  return sha_signature
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: certificate_pem,
  key: certificate_key,
  ca: certificate_ca,
  host: 'mtls-mp.hml.flagship.maas.link'
})

const api = axios.create({
  baseURL: 'https://mtls-mp.hml.flagship.maas.link',
  httpsAgent
})

export async function tokenGenerator() {
  let token

  token = await api
    .post(
      '/auth/realms/Matera/protocol/openid-connect/token',
      {
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret
      },
      {
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    .then((response) => {
      return response.data.access_token
    })
    .catch((e) => console.error(e))

  return token
}

export async function createAccountAPI(accountData: z.infer<typeof accountSchema>, token) {
  let response
  const data = {
    externalIdentifier: `${uuidv4()}${now}`,
    clientType: 'CORPORATE',
    accountType: 'UNLIMITED_ORDINARY',
    client: {
      name: accountData.ownerName,
      taxIdentifier: {
        taxId: accountData.companyDocument,
        country: 'BRA'
      },
      mobilePhone: {
        country: 'BRA',
        phoneNumber: accountData.companyPhoneNumber
      },
      email: accountData.companyEmailAddress
    },
    billingAddress: {
      logradouro: accountData.companyAddress,
      numero: accountData.companyAddressNumber,
      complemento: accountData.companyAddressComplement,
      bairro: accountData.companyNeighborhood,
      cidade: accountData.companyCity,
      estado: accountData.companyState,
      cep: accountData.companyCodezip,
      pais: 'BRA'
    },
    additionalDetailsCorporate: {
      establishmentDate: accountData.companyDateCreated,
      companyName: accountData.companyName,
      businessLine: 47,
      establishmentForm: 1,
      representatives: [
        {
          name: accountData.ownerName,
          mother: accountData.ownerMotherName,
          birthDate: accountData.ownerBirthday,
          taxIdentifier: {
            taxId: accountData.ownerDocument,
            country: 'BRA'
          },
          mobilePhone: {
            country: 'BRA',
            phoneNumber: accountData.ownerPhoneNumber
          },
          email: accountData.ownerEmailAddress,
          mailAddress: {
            logradouro: accountData.ownerAddress,
            numero: accountData.ownerAddressNumber,
            complemento: accountData.ownerAddressComplement,
            bairro: accountData.ownerNeighborhood,
            cidade: accountData.ownerCity,
            estado: accountData.ownerState,
            cep: accountData.ownerCodezip,
            pais: 'BRA'
          },
          documents: [
            {
              content:
                'iVBORw0KGgoAAAANSUhEUgAAAXEAAACXCAIAAABsj/zYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASySURBVHhe7d1rcqJAGIbRWZcLYj2uxs24mIx4SSWKdIMvGOlzfmaiHayvn/IG8+8LIEdTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUhquSnH42G/77pd79+D/qddt98fjsfr7wNlLTbllJJuICKjdt0pLtfbP3fcT73fKt3hev/fSgvt9q+FMHwgA39OaYXHYz5b7RFmttaacpyekx9KW1VThmlKS1pqSmYex8ZvtYkvLaQp02hKUDtNOXTX+XnZ8w2rKcM0pSWtNCVXlN6zLaspwzSlJW00pTiJu/4DnrP9vhv6FOje8BCuNvGlhTRlGk0JaqIp44M4tP+Oxec1g1O42sSXFtKUaTQlqIWmjM7h0903Z+hXm/jSQpoyjaYEtdCU0eccI7tv/LnK0A2X3urf3t2U1w9koabEHmFma74pI2N4m9/zF2173c35vZeB79euNvFLL7T8gZRW0JSP1fxrn4tTL/ov4S+9UTTlW2kFTflYTbxHO+2D5L4vM8/y0ZRqmrJZTTRl/rdTLnm53ktZaeJnGN5b725Kred/x0JNmeHJSszVRlPmR+XmbecQasovmvL3NdKUQFV6pbJoyh1NaVAzTQnuk+5pV1ab+NJCmlJPU8IaasrJ8fDKlQ5+ePfEa0qOpoS11ZSzTFgGd4um3NGUBjXYlIs5F3v7bWC/aModTWlQs0256S9KW3Um8qPHDaMpdzSlQc035YdTXqb15WHHLL3Vv727Ka8fyEJNiT3CzKYpgypfGd0PvqZU05TN2nxTTs89ev1/unFxPR/wMpqjz3vLF1G5n2BNqaYpm7X1phRmsDSCharc33y1iV96oeUPpLSCpnyszT9PmViFO4UR9tpnttIKmvKxtv/a56UhHC/Sw21Xm/ilF1r+QEoraMrH2v57tKUpfDq+M+a+vNY8k+M13e9jWX7rTn5sL1Z7hJlt+02pOn1w93Bu4PFQmt6BMdSUapqyWS00pf6c5OtHQlVjOzT0mlJNUzariaZMqEqt4RnUlGqaslmNNCVclScDryn1NGWzmmnKaRwzWRm5fIqm1NOUzWqoKSflN17HjfWkpynVNGWz2mrK2ayrHLzterRnmnKjKX9fg035dj4N+XoC0HW0fuh/evrX/aGiJcBNy00B8jQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIElTgCRNAZI0BUjSFCBJU4AkTQGSNAVI0hQgSVOAJE0BkjQFSNIUIOfr6z8cMM6YMGZbBwAAAABJRU5ErkJggg==',
              type: 'PICTURE'
            },
            {
              content:
                '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',
              type: 'IDENTITY_FRONT'
            },
            {
              content:
                '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',
              type: 'IDENTITY_BACK'
            }
          ]
        }
      ]
    }
  }

  const sha_signature = await encrypt_string(data.externalIdentifier + accountData.companyDocument)

  response = await api
    .post('/v1/accounts', data, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((response) => {
      if (response.status == 200) return response.data
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        console.log('Error', error.message)
      }
      return error.response.data
    })

  return response
}

export async function VerifyAccountAPI(token, AccId) {
  let response
  const sha_signature = await encrypt_string(AccId)

  response = await api
    .get(`/v1/accounts/${AccId}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res: any) => {
      console.log(res.data)
      if (res.status === 200) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        console.log('Error', error.message)
      }
      return error.response.data
    })

  return response.data
}

export async function DeleteAccountAPI(token, AccId) {
  let response
  const sha_signature = await encrypt_string(AccId)
  response = await api
    .delete(`/v1/accounts/${AccId}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res: any) => {
      if (res.status === 200 || res.status === 202) return res.status
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response)
        console.log('Error', error.message)

      } else {
        console.log(error.response.data)

        console.log('Error', error.message)
      }
      return error.response.data
    })
  return response
}

export async function createAliasesAPI(token: string, AccId: string) {
  const sha_signature = await encrypt_string(`post:/v1/accounts/${AccId}/aliases:`)
  const data = {
    externalIdentifier: `${uuidv4()}${now}`,
    alias: {
      type: 'EVP'
    }
  }
  let response = await api
  .post(`/v1/accounts/${AccId}/aliases`, data, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      'Transaction-Hash': sha_signature
    },
    httpsAgent
  })
  .then((res): any => {
    if (res.status == 202) return res.data
  })
  .catch((error) => {
    if (error.response) {
      console.log(error.response.data)
    } else {
      console.log('Error', error.message)
    }
  })

  return response.data
}

export async function deleteAliases(token: string, AccId: string, alias: string) {
  const sha_signature = await encrypt_string(`delete:/v1/accounts/${AccId}/aliases/${alias}`)

  let response = await api
  .delete(`/v1/accounts/${AccId}/aliases/${alias}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      'Transaction-Hash': sha_signature
    },
    httpsAgent
  })
  .then((res: any) => {
    if (res.status == 202) return res.status
  })
  .catch((error) => {
    if (error.response) {
      console.error(error.response.data)
    } else {
      console.error('Error', error.message)
    }
  })

  return response
}

export async function verifyAliases(token: string, AccId: string) {
  let response = await api
    .get(`/v1/accounts/${AccId}/aliases`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      httpsAgent
    })
    .then((res) => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error', error.message)
      }
    })

  return response.data
}

// export async function verifyAliasesComplete(token: string) {
//   const data = await dbRead()
//   const AccountID = data.AccountId
//   const Alias = data.Aliases
//   //const sha_signature = await encrypt_string(`post:/v1/accounts/${AccountiD}/aliases`)

//   let response = await api.get(`/v1/accounts/${AccountID}/aliases/BRA/${Alias}`, {
//     headers: {
//       ...headers,
//       'Authorization': `Bearer ${token}`,
//     },
//     httpsAgent
//   }).then( res => {
//     if(res.status == 200 || res.status == 202)
//       return res.data
//   }).catch(error => {
//     if(error.response) {
//       console.error(error.response.data)
//     } else {
//       console.error('Error', error.message);
//     }
//   })

//   return {response, AccountID}
// }

export async function createInstantPayment(
  paymentFile: any,
  token: string,
  AccId: string,
  Alias: string,
  MedId,
  MedFee
) {
  let response
  let totalAmount = paymentFile.totalAmount | 0
  let recipientAmount = paymentFile.totalAmount | 0
  const valorHash = Alias + totalAmount + AccId + recipientAmount

  const sha_signature = await encrypt_string(valorHash)

  const paymentData = {
    externalIdentifier: uuidv4() + now,
    totalAmount: totalAmount,
    currency: 'BRL',
    paymentInfo: {
      transactionType: 'InstantPayment',
      instantPayment: {
        alias: Alias,
        qrCodeImageGenerationSpecification: {
          errorCorrectionLevel: 'M',
          imageWidth: 400,
          generateImageRendering: true
        },
        expiration: 86400,
        additionalInformation: [
          {
            name: paymentFile.orderID,
            content: paymentFile.customerID + '-' + paymentFile.orderID,
            showToPayer: true
          }
        ]
      }
    },
    recipients: [
      {
        account: {
          accountId: MedId
        },
        amount: recipientAmount,
        currency: 'BRL',
        mediatorFee: MedFee,
        recipientComment: paymentFile.recipientComment
      }
    ],
    callbackAddress: 'https://testemockqr.requestcatcher.com/'
  }

  response = await api
    .post(`/v1/payments`, paymentData, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res): any => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response.data
}

export async function verifyInstantPayment(transactionid: string, token: string, AccId: string) {
  let response
  const valorHash = `get:/v2/accounts/${AccId}/transactions/${transactionid}`
  const sha_signature = await encrypt_string(valorHash)

  response = await api
    .get(`/v2/accounts/${AccId}/transactions/${transactionid}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res): any => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response.data
}

export async function verifyBalance(token: string) {
  let response
  const db = await getClientDB()
  console.log(db)
  const sha_signature = await encrypt_string(String(db?.accountId))

  response = await api
    .get(`/v2/accounts/${String(db?.accountId)}/balance`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res): any => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response.data
}

export async function extractBalanceToday(token: string, AccId: string) {
  let response
  let date = new Date().toISOString()
  let formateDate = date.split('T') // '2023-06-15'
  const sha_signature = await encrypt_string(AccId)

  response = await api
    .get(`/v1/accounts/${AccId}/statement?ending=${formateDate[0]}&start=${formateDate[0]}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res): any => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response.data
}

export async function extractBalanceFilter(
  token: string,
  dateStart: string,
  dateEnd: string,
  AccId: string
) {
  let response
  const sha_signature = await encrypt_string(AccId)
  response = await api
    .get(`/v1/accounts/${AccId}/statement?ending=${dateEnd}&start=${dateStart}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res): any => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response.data
}

export async function refundCodes(token: string) {
  let response
  response = await api
    .get(`v1/instant-payments/BRA/return-codes`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      httpsAgent
    })
    .then((res) => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response
}

export async function refundInstantPayment(
  item: any,
  reasonCode: string,
  token: string,
  AccId: string
) {
  let response
  const valorHash = item.amount.toFixed(0) + AccId + item.transactionid + reasonCode
  const sha_signature = await encrypt_string(valorHash)

  const data = {
    externalIdentifier: uuidv4() + now,
    amount: item.amount,
    returnReasonCode: reasonCode,
    mediatorFee: 1
  }

  response = await api
    .post(`v1/accounts/${AccId}/instant-payments/${item.transactionid}/returns`, {
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res) => {
      if (res.status == 200 || res.status == 202) return res.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
        console.error('Error: ', error)
      }
    })

  return response
}
