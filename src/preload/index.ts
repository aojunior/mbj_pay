import { contextBridge, ipcRenderer } from 'electron'

const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  navigate: (route) => ipcRenderer.send('navigate', route),
  // onCount: (callback) => ipcRenderer.on("count", (_, args) => callback(args)),
  reciveFile: (callback) => ipcRenderer.on("file", (_, args) => callback(args)),
  tokenGenerator: () => ipcRenderer.send("token_generator"),
  accessToken: (callback) => ipcRenderer.on("access_token", (_, args) => callback(args)),
  createAccount: (data, token) => ipcRenderer.send('create_account', {data, token}),
  verifyAccount: () => ipcRenderer.send("verify_account"),
  createAlias: (token) => ipcRenderer.send("create_alias", token),
  verifyAlias: (token) => ipcRenderer.send("verify_alias", token),
  
};

contextBridge.exposeInMainWorld("api", API);
