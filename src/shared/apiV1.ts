import { createHmac } from 'crypto'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getClientDB } from './database/actions'
import { today } from './utils'
import { logger } from './logger'
import { handleStatusError } from './handleErrors'

const now = new Date().toISOString()
const SecretKey = import.meta.env.MAIN_VITE_SECRETKEY

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

const api = axios.create({ baseURL: 'http://localhost:3000/api/v1' })

// ======  Services
export async function tokenGeneratorAPIV1() {
  let token = await api.post('/auth/token').then((response) => {
    logger.info('CREATED TOKEN')
    return response.data.access_token
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return null
  })
  return token
}
 
export async function getLocationAndIPV6V1() {
  const res = await axios.get('https://api.ipbase.com/v1/json/').then((e) => e.data)
  return res
}

export async function getPspListAPIV1(token) {
  let psp = await api.get('/psp',{
    data: {
      token
    }
  }
  ).then((response) => {
    return response.data
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return null
  })
  return psp
}

// ======  Account
export async function createAccountAPIV1(accountData, token) {
  let response = await api.post('/accounts', {
    data: {
      accountData: accountData,
      token: token
    }
  }).then((res) => {
    if (res.status == 200) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })

  return response
}

export async function SignInAPIV1({taxId, password}) {
  let response = await api.get(`/accounts/signin`, {
    data:{
      credential: taxId,
      password
    }
  }).then((res: any) => {
    if (res.status === 200) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })

return response
}

export async function VerifyAccountAPIV1(token, AccId) {
  let response = await api.get(`/accounts`, {
    data:{
      accountID: AccId,
      token: token
    }
  }).then((res: any) => {
    if (res.status === 200) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
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

// ======  Alias
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

// ======  Instant Payment
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

// ======  Balance
export async function verifyBalance(token: string, accountId: string) {
  let response
  const db = await getClientDB(accountId)
  const sha_signature = await encrypt_string(String(db?.accountId))

  response = await api.get(`/v2/accounts/${String(db?.accountId)}/balance`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Transaction-Hash': sha_signature
      },
      
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

// ======  Refund
export async function refundCodes(token: string) {
  let response
  response = await api
    .get(`v1/instant-payments/BRA/return-codes`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      
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

// ======  Cash Out

export async function verifyRecipientAlias(params: {accID: string, pixKey: string}, token: string) {
  let response

  response = await api
  .get(`v2/accounts/${params.accID}/aliases/BRA/${params.pixKey}`, {
    headers:{
      ...headers,
      Authorization: `Bearer ${token}`
    },
    
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