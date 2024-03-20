import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('context', {
    //   locale: navigator.language,
    //   firstRender: () => ipcRenderer.invoke('mkdir', 'mensagem')
    // })
    contextBridge.exposeInMainWorld('electronAPI', {
      setTitle: (title) => ipcRenderer.send('set-title', title),
      render: () => ipcRenderer.send('mkdir', 'mensagem')
    })
    // contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
