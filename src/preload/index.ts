import { contextBridge, ipcRenderer, ipcMain } from 'electron'
import { totalmem, cpus } from 'os';


const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  createAccount: (data, token) => ipcRenderer.send('create_account', {data, token}),
  // onCount: (callback) => ipcRenderer.on("count", (_, args) => callback(args)),
  reciveFile: (callback) => ipcRenderer.on("file", (_, args) => callback(args)),
  tokenGenerator: () => ipcRenderer.send("token_generator"),
  accessToken: (callback) => ipcRenderer.on("access_token", (_, args) => callback(args)),
};



contextBridge.exposeInMainWorld("api", API);
