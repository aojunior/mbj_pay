import { contextBridge } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'
import fs from 'node:fs'
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    if(!fs.existsSync('C:/ClientPix')) {
      fs.mkdirSync('C:/ClientPix/Resp', {recursive: true})
      fs.mkdirSync('C:/ClientPix/Req', {recursive: true})
      fs.mkdirSync('C:/ClientPix/print', {recursive: true})
    }
    contextBridge.exposeInMainWorld('context', {
      
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
