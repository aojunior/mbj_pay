import { createHmac } from 'crypto'
import axios from 'axios'
import https from 'https'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync } from 'fs'
import { z } from 'zod'
import { accountSchema } from './schemas'
import { getClientDB } from './database/actions'
import { today } from './utils'

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

export async function getLocationAndIPV6() {
  const api = await axios.get('https://api.ipbase.com/v1/json/').then((e) => e.data)
  return api
}

export async function tokenGeneratorAPI() {
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
        taxId: accountData.companyDocument, //'81667817000110',
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
      companyName: accountData.companyFantasyName,
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
              content: accountData.imgSelfie,
              type: 'PICTURE'
            },
            {
              content: accountData.imgRgFront,
              type: 'IDENTITY_FRONT'
            },
            {
              content: accountData.imgRgBack,
              type: 'IDENTITY_BACK'
            }
          ]
        }
      ]
    },
    customData: {
    connectionDetails: {
    countryCode: "BRA",
    countryName: accountData.contry,
    city: accountData.city,
    state: accountData.state,
    zipCode: accountData.zipCode,
    ipAddress: accountData.ip,
    geolocation: {
    latitude: accountData.latitude,
    longitude: accountData.longitude
    },
    deviceId: accountData.idDevice
    }
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
  .then((res) => {
    if (res.status == 200) return {data: res.data.data, message: 'SUCCESS'}
  })
  .catch((error) => {
    if (error.response) {
      console.log(error.response.data)
    } else {
      console.log('Error', error.message)
    }

    if(error.response.status == 503) {
      return {data: error, message: 'NETWORK_ERROR'}
    } else {
      return {data: error, message: 'GENERIC_ERROR'}
    }
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
      if (res.status === 200) return {data: res.data.data, message: 'SUCCESS'}
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        console.log('Error', error.message)
      }
      if(error.response.status == 503) {
        return {data: null, message: 'NETWORK_ERROR'}
      } else {
        return {data: null, message: 'GENERIC_ERROR'}
      }
    })

  return response
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
      // if (error.response) {
      //   console.log(error.response.data)
      //   console.log(error.response)
      //   console.log('Error', error.message)
      // } else {
      //   console.log(error.response.data)

      //   console.log('Error', error.message)
      // }
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
        return error.response.status
      } else {
        console.log('Error', error.message)
        return error.response.status
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
        console.error(error.message)
        return error.response.status
      } else {
        console.error('Error', error.message)
        return error.response.status
      }
    })

  return response
}

export async function verifyAliasesAPI(token: string, AccId: string) {
  let response = await api
    .get(`/v1/accounts/${AccId}/aliases`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      httpsAgent
    })
    .then((res) => {
      if (res.status == 200 || res.status == 202) return res.data.data
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
        return error.response.status
      } else {
        console.error('Error', error.message)
        return error.response.status
      }
    })

  return response
}

export async function createInstantPayment(
  paymentFile: any,
  token: string,
  AccId: string,
  Alias: string,
  MedFee: number,
) {
  let response
  let totalAmount = Number(paymentFile.totalAmount)
  let recipientAmount = Number(paymentFile.totalAmount) | 0
  const valorHash = Alias + recipientAmount + AccId + String(recipientAmount)
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
        expiration: 1800,
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
          accountId: AccId
        },
        amount: totalAmount,
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
      if (res.status == 200 || res.status == 202) return {data: res.data.data, message: 'SUCCESS'}
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
      if(error.response.status == 503) {
        return {data: null, message: 'NETWORK_ERROR'}
      } else {
        return {data: null, message: 'GENERIC_ERROR'}
      }
    })
    return response
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
        return 
      } else {
        console.error('Error: ', error.message)
      }
    })

  return response.data
}

export async function verifyBalance(token: string) {
  let response
  const db = await getClientDB()
  const sha_signature = await encrypt_string(String(db?.accountId))

  response = await api.get(`/v2/accounts/${String(db?.accountId)}/balance`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      httpsAgent
    })
    .then((res): any => {
      if (res.status == 200 || res.status == 202) return {data: res.data.data, message: 'SUCCESS'}
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
      if(error.response.status == 503) {
        return {data: null, message: 'NETWORK_ERROR'}
      } else {
        return {data: null, message: 'GENERIC_ERROR'}
      }
    })

  return response
}

export async function extractBalanceToday(token: string, AccId: string) {
  let response
  const sha_signature = await encrypt_string(AccId)
  response = await api.get(`/v1/accounts/${AccId}/statement?ending=${today}&start=${today}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Transaction-Hash': sha_signature
    },
    httpsAgent
  }).then((res): any => {
    if (res.status == 200 || res.status == 202) return {data: res.data.data, message: 'SUCCESS'}
  }).catch((error) => {
    if (error.response) {
      console.error(error.response.data)
    } else {
      console.error('Error: ', error.message)
    }
    if(error.response.status == 503) {
      return {data: null, message: 'NETWORK_ERROR'}
    } else {
      return {data: null, message: 'GENERIC_ERROR'}
    }
  })
  return response
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
      if (res.status == 200 || res.status == 202) return {data: res.data.data, message: 'SUCCESS'}
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error: ', error.message)
      }
      if(error.response.status == 503) {
        return {data: null, message: 'NETWORK_ERROR'}
      } else {
        return {data: null, message: 'GENERIC_ERROR'}
      }
    })

  return response
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
        return error.response.status
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
  AccId: string,
  medFee: number
) {
  let response
  const valorHash = item.amount.toFixed(0) + AccId + item.transactionid + reasonCode
  const sha_signature = await encrypt_string(valorHash)

  const data = {
    externalIdentifier: uuidv4() + now,
    amount: item.amount,
    returnReasonCode: reasonCode,
    mediatorFee: medFee
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

  return response.data
}

// ---- CASH OUT
export async function verifyRecipientAlias(params: {accID: string, pixKey: string}, token: string) {
  let response

  response = await api
  .get(`v2/accounts/${params.accID}/aliases/BRA/${params.pixKey}`, {
    headers:{
      ...headers,
      Authorization: `Bearer ${token}`
    },
    httpsAgent
  }).then((res) => {
    return res.data
  }).catch((error) => {
    if (error.response) {
      console.error(error.response.data)
    } else {
      console.error('Error: ', error.message)
      console.error('Error: ', error)
    }
  })

  return response
}