import { contextBridge, ipcRenderer } from 'electron'
import { totalmem, cpus } from 'os';

const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  // onCount: (callback) => ipcRenderer.on("count", (_, args) => callback(args)),
  reciveFile: (callback) => ipcRenderer.on("file", (_, args) => callback(args)),
  tokenGenerator: () => ipcRenderer.send("tokenGenerator"),
  accessToken: () => ipcRenderer.on("access_token", (_, args) => args),
};

contextBridge.exposeInMainWorld("api", API);