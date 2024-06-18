import { contextBridge, ipcRenderer } from 'electron'

export const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  navigate: (route) => ipcRenderer.send('navigate', route),
  initialMain: () => ipcRenderer.send('initial_', ),
  initialRender: (callback) => ipcRenderer.on("_initial", (_, args) => callback(args)),
  
  reciveFile: (callback) => ipcRenderer.on("file", (_, args) => callback(args)),
  cancelPayment: () => ipcRenderer.send("cancel_payment", ),
  tokenGenerator: () => ipcRenderer.send("token_generator"),
  accessToken: (callback) => ipcRenderer.on("access_token", (_, args) => callback(args)),
  createAccount: async(clientData) => {
    const response = await ipcRenderer.invoke('create-account', clientData)
    return response
  },
  checkClient: async() => {
    const exists = await ipcRenderer.invoke('check-client')
    return exists
  },
  verifyAccount: async () => {
    const verify = ipcRenderer.invoke("verify-account")
    return verify
  },
  get_account: () => ipcRenderer.send("get_account"),
  getAccount: (callback) => ipcRenderer.on("getAccount", (_, args) => callback(args)),

  createAlias: () => ipcRenderer.send("create_alias", ),
  verifyAlias: () => ipcRenderer.send("verify_alias", ),
  responseVerifyAlias: (callback) => ipcRenderer.on("response_verify_alias", (_, args) => callback(args) ),
  
  createInstantPayment: (data) => ipcRenderer.send("create_instantpayment", data),
  cancelInstantPayment: () => ipcRenderer.send("cancel_instantpayment", ),
  verifyInstantPayment: () => ipcRenderer.send("verify_instantpayment", ),
  responseVerifyInstantPayment: (callback) => ipcRenderer.on("response_verify_instantpayment", (_, args) => callback(args)),
  
  refundCodes: () => ipcRenderer.send('refund_codes',),
  responseRefundCodes: (callback) => ipcRenderer.on("respose_refund_codes", (_, args) => callback(args)),

  refundInstantPayment: (item, reasonCode) => ipcRenderer.send("refund", [item, reasonCode]),
  responseRefundInstantPayment: (callback) => ipcRenderer.on("response_refund",  (_, args) => callback(args)),
  
  verifyBalance: () => ipcRenderer.send("verify_balance", ),
  responseBalance: (callback) => ipcRenderer.on("response_balance", (_, args) => callback(args)),
  extractBalanceToday: () => ipcRenderer.send("extract_balance_today", ),
  extractBalanceFilter: (start, end) => ipcRenderer.send("extract_balance_filter", [start, end]),
  
  responseExtractToday: (callback) => ipcRenderer.on("response_extract_today", (_, args) => callback(args)),
  responseExtractFilter: (callback) => ipcRenderer.on("response_extract_filter", (_, args) => callback(args)),
};

contextBridge.exposeInMainWorld("api", API);