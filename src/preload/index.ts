import { contextBridge, ipcRenderer } from 'electron'

export const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  navigate: (route) => ipcRenderer.send('navigate', route),
  reciveFile: (callback: (data: any) => void) => ipcRenderer.on('watch_file', (event, data) => callback(data)),
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
  verifyAlias: async () => {
    const aliases = await ipcRenderer.invoke('verify-alias')
    return aliases
  },
  security: async (password) => {
    const credentials = ipcRenderer.invoke('security', password)
    return credentials
  },

  createInstantPayment: (data) => ipcRenderer.send('create_instantpayment', data),
  cancelInstantPayment: async () => {
    const cancelPayment = await ipcRenderer.send('cancel_instantpayment')
    return cancelPayment
  },
  verifyInstantPayment: async () => {
    const verifyPayment = await ipcRenderer.invoke('verify_instantpayment')
    return verifyPayment
  },

  refundCodes: () => ipcRenderer.send('refund_codes'),
  responseRefundCodes: (callback) =>
    ipcRenderer.on('respose_refund_codes', (_, args) => callback(args)),

  refundInstantPayment: (item, reasonCode) => ipcRenderer.send('refund', [item, reasonCode]),
  responseRefundInstantPayment: (callback) =>
    ipcRenderer.on('response_refund', (_, args) => callback(args)),

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
  }
}

contextBridge.exposeInMainWorld('api', API)
