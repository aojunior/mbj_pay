import { contextBridge, ipcRenderer } from 'electron'

const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  navigate: (route) => ipcRenderer.send('navigate', route),
  // onCount: (callback) => ipcRenderer.on("count", (_, args) => callback(args)),
  reciveFile: (callback) => ipcRenderer.on("file", (_, args) => callback(args)),
  tokenGenerator: () => ipcRenderer.send("token_generator"),
  accessToken: (callback) => ipcRenderer.on("access_token", (_, args) => callback(args)),
  createAccount: (data) => ipcRenderer.send('create_account', data ),
  verifyAccount: () => ipcRenderer.send("verify_account"),
  createAlias: () => ipcRenderer.send("create_alias", ),
  verifyAlias: () => ipcRenderer.send("verify_alias", ),
};

contextBridge.exposeInMainWorld("api", API);
