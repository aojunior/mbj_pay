import { contextBridge, ipcRenderer } from 'electron'


export const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  navigate: (route) => ipcRenderer.send('navigate', route),
  reciveFile: (callback: (data: any) => void) => ipcRenderer.on('watch_file', (_, data) => callback(data)),
  cancelPayment: () => ipcRenderer.send('cancel_payment'),
  acceptTermsOfService: async () => {
    const a = await ipcRenderer.invoke('accept_terms_of_service')
    return a
  },
  tokenGenerator: async () => {
    const newToken = await ipcRenderer.invoke('token_generator')
    return newToken
  },
  createAccount: async (clientData) => {
    const response = await ipcRenderer.invoke('create_account', clientData)
    return response
  },
  deleteAccount: async () => {
    const del = await ipcRenderer.invoke('delete_account')
    return del
  },
  verifyAccount: async () => {
    const verify = await ipcRenderer.invoke('verify_account')
    return verify
  },
  getAccount: async () => {
    const account = ipcRenderer.invoke('get_account')
    return account
  },
  signIn: async (signInData) => {
    const response = await ipcRenderer.invoke('signIn', signInData)
    return response
  },
  alterPassword: async (password) => {
    const alterPass = await ipcRenderer.invoke('alter_password', password)
    return alterPass
  },
  createAlias: async () => {
    const alias = await ipcRenderer.invoke('create-alias')
    return alias
  },
  deleteAlias: async (aliasData) => {
    const alias = await ipcRenderer.invoke('delete-alias', aliasData)
    return alias
  },
  updateAlias: async () => {
    const alias = await ipcRenderer.invoke('update-alias')
    return alias
  },
  getAlias: async () => {
    const aliases = await ipcRenderer.invoke('get_alias')
    return aliases
  },
  createFavoriteRecipient: async (data) => {
    const resp = await ipcRenderer.invoke('create_favorite_recipient', data)
    return resp
  },
  updateFavoriteRecipient: async (data) => {
    const resp = await ipcRenderer.invoke('update_favorite_recipient', data)
    return resp
  },
  getFavoriteRecipients: async () => {
    const data = await ipcRenderer.invoke('get_favorite_recipients')
    return data
  },
  getFavoriteRecipientOnId: async (id) => {
    const data = await ipcRenderer.invoke('get_favorite_recipient_on_id', id)
    return data
  },
  deleteFavoriteRecipients: async (id) => {
    const data = await ipcRenderer.invoke('delete_favorite_recipient', id)
    return data
  },
  verifyRecipientAlias: async (data) => {
    const response = await ipcRenderer.invoke('verify_recipientAlias', data)
    return response
  },
  security: async (password) => {
    const credentials = await ipcRenderer.invoke('security', password)
    return credentials
  },
  createPaymentFile: (data) => ipcRenderer.invoke('create_payment_file', data),
  createInstantPayment: (data) => ipcRenderer.send('create_instantpayment', data),
  cancelInstantPayment: async (data) => {
    const cancelPayment = await ipcRenderer.invoke('cancel_instantpayment', data)
    return cancelPayment
  },
  verifyInstantPayment: async () => {
    const verifyPayment = await ipcRenderer.invoke('verify_instantpayment')
    return verifyPayment
  },
  finishInstantPayment: async (data) => {
    const finish = await ipcRenderer.invoke('finished_instantpayment', data)
    return finish
  },
  refundCodes: async () => {
    const codes = await ipcRenderer.invoke('refund_codes')
    return codes
  },
  refundInstantPayment: async (item, reasonCode) => {
    const response = await ipcRenderer.invoke('refund', [item, reasonCode])
    return response
  },

  responseRefundInstantPayment: (callback) => ipcRenderer.on('response_refund', (_, args) => callback(args)),

  verifyBalance: async () => {
    const verifyBalance = await ipcRenderer.invoke('verify_balance')
    return verifyBalance
  },
  extractBalanceToday: async () => {
    const extractToday = await ipcRenderer.invoke('extract_balance_today')
    return extractToday
  },
  extractBalanceFilter: async (start, end) => {
    const extractFilter = await ipcRenderer.invoke('extract_balance_filter', [start, end])
    return extractFilter
  },
  getAllPsps: async () => {
    const psps = await ipcRenderer.invoke('psp_list')
    return psps
  },
  getRegisterDevice: async () => {
    const result = await ipcRenderer.invoke('get_register_device')
    return result
  }, 
  registerDevice: async () => {
    const result = await ipcRenderer.invoke('register_device')
    return result
  },
  sendEmail: async () => {
    const result = await ipcRenderer.invoke('send_email')
    return result
  },
  verifyCode: async (code) => {
    const result = await ipcRenderer.invoke('verify_token', code)
    return result
  },

  logger: (type, msg) => ipcRenderer.send('logger', {type, msg}),

  checkUpdates: () => ipcRenderer.send('check-for-updates'),
  onUpdateAvailable: (callback: () => void) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update_downloaded', callback),
  sendRestartApp: () => ipcRenderer.send('restart_app'),
  updateNotAvailable: () => ipcRenderer.on('update-not-available', (_, args) => args),
  updateError: () => ipcRenderer.on('error', (_, error) => error),

  // ---
  decodingQrCode: async (data) => {
    const result = await ipcRenderer.invoke('decoding', data)
    return result
  },
  verifyDestination: (data) =>{
    const result = ipcRenderer.invoke('verify_destination', data)
    return result
  },
  fakePayment: async (data) => {
    const result = ipcRenderer.invoke('fake_payment', data)
    return result
  },
  cashOut: async (data) => {
    const result = ipcRenderer.invoke('cash_out', data)
    return result
  }
}

contextBridge.exposeInMainWorld('api', API)
