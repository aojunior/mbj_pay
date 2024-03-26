import { contextBridge, ipcRenderer } from 'electron'
import { totalmem, cpus } from 'os';

const API = {
  a: 'apii',
  sendMsg: (msg) => ipcRenderer.send('message', msg),
  // onCount: (callback) => ipcRenderer.on("count", (_, args) => callback(args)),
  sendFile: (callback) => ipcRenderer.on("file", (_, args) => callback(args))
};

contextBridge.exposeInMainWorld("api", API);