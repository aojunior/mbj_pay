import { createHmac } from 'crypto'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
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
const URL = process.env.NODE_ENV === 'production' || process.platform === 'linux' ? import.meta.env.MAIN_VITE_URL : 'http://localhost'
const PORT = process.env.NODE_ENV === 'production' ? import.meta.env.MAIN_VITE_API_PORT : 3000
const api = axios.create({ baseURL: `${URL}:${PORT}/api/v1`})

// ======  Services
export async function tokenGeneratorAPIV1() {
  let token = await api.post('/auth/token').then((response) => {
    logger.info('CREATED TOKEN')
    return {data: response.data.access_token, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(JSON.stringify  (error.response.data))
    else if(error.message) logger.error(error.message)
    else logger.error(JSON.stringify(error))
    return handleStatusError(error.response.status)
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

export async function VerifyAccountAPIV1(token, accountId) {
  let response = await api.get(`/accounts`, {
    data:{
      accountId,
      token
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

export async function DeleteAccountAPIV1(token, accountId) {
  let data = {
    token, 
    accountId
  }
  let response = await api.delete(`/accounts`, {
    data,
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

// ======  Alias
export async function createAliasesAPIV1(token: string, AccId: string) {
  const data = {
    token: token,
    accountId: AccId,
  }
  let response = await api.post(`/aliases`, data).then((res): any => {
    logger.info('Creating alias')
    if (res.status == 202) return res.data
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(JSON.stringify(error.response.data))
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

export async function deleteAliasesAPIV1(token: string, AccId: string, alias: string) {
  let data = {
    token: token,
    accountId: AccId,
    alias: alias
  }
  let response = await api.delete(`/aliases`, {
    data
  }).then((res: any) => {
    if (res.status == 202) return {data: res.status, message: 'deleted'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })

  return response
}

export async function verifyAliasesAPIV1(token: string, AccId: string) {
  let response = await api.get(`/aliases`, {
    data: {
      token: token,
      accountId: AccId
    }
  }).then((res) => {
    if (res.status == 200) {
      return {data: res.data, message: 'success'}
    }
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })

  return response
}

// ======  Instant Payment
export async function createInstantPaymentAPIV1(
  paymentFile: any,
  token: string,
  AccId: string,
  Alias: string,
  MedFee: number,
) {
  const data = {
    paymentFile,
    token,
    accountId: AccId,
    alias: Alias,
    mediatorFee: MedFee
  }

  let response = await api.post(`/payments`, data).then((res): any => {
    if (res.status == 200 || res.status == 202) return {data: res.data, message: 'success'};
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
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

// ======  Decoding Payment
export async function decodePaymentV1(qrCode, datePayment, token) {
  let data = {
    qrCode,
    datePayment,
    token
  }

  let response = await api.post(`/qrcode/decoding`, data).then((res) => {
    if (res.status == 200 || res.status == 202) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

export async function consultingDestinationV1(file, token) {
  let data = {
    alias: file.alias,
    accountId: file.accountId,
    token
  }
  let response = await api.get(`/destination`, { data }).then((res) => {
    if (res.status == 200 || res.status == 202) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

export async function fakePaymentAPIV1(file, acc, token) {
  let data = {
    file,
    account: acc,
    token
  }
  let response = await api.post(`/payment/fake`, data).then((res) => {
    if (res.status == 200 || res.status == 202) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

// ======  Cash Out
export async function cashOutAPIV1(file, token) {
  let response = await api.post(`/cashout`, {
    data: {
      file,
      token
    }
  }).then((res) => {
    if (res.status == 200 || res.status == 202) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}


// ======  Balance
export async function verifyBalanceV1(token: string, accountId: string) {
  let data = {
    token,
    accountId
  }
  let response = await api.get(`/balance`, {
    data
  }).then((res): any => {
    if (res.status == 200) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

export async function extractBalanceTodayV1(token: string, accountId: string) {
  let data = {
    token,
    accountId
  }
  let response = await api.get(`/extract`, {
    data
  }).then((res): any => {
    if (res.status == 200) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

export async function extractBalanceFilterV1(token: string, dateStart: string, dateEnd: string, accountId: string) {
  let response = await api.get(`/extract/filter?dateEnd=${dateEnd}&dateStart=${dateStart}`, {
    data: {
    token,
    accountId
    }
  }).then((res): any => {
    if (res.status == 200 || res.status == 202) return {data: res.data, message: 'success'};
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
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

// ====== Email
export async function sendEmailAPIV1(accountId: string, email: string) {
  let response = await api.get(`/email/?accountId=${accountId}`,{
    data: {
      email
    }}
  ).then((res) => {
    if (res.status == 200) return {data: res.data, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}

export async function verifyCodeAPIV1(accountId: string, token: string) {
  let response = await api.get(`/email/verify-token`, {
    data: {
      accountId,
      token
    }}
  ).then((res) => {
    if (res.status == 200) return {data: true, message: 'success'}
  }).catch((error) => {
    if(error.response.data.Message) logger.error(error.response.data.Message)
    else if(error.response.data) logger.error(error.response.data)
    else logger.error(error.message)
    return handleStatusError(error.response.status)
  })
  return response
}