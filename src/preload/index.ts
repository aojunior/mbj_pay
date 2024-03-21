// import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// const api = {}

// if (process.contextIsolated) {
//   try {
//     // contextBridge.exposeInMainWorld('context', {
//     //   locale: navigator.language,
//     // })
//     contextBridge.exposeInMainWorld('electronAPI', {
//       render: () => ipcRenderer.send('mkdir', 'mensagem'),
//       readFile: () => ipcRenderer.on('file-content', (_, data) => _),

//     })
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   // @ts-ignore (define in dts)
//   // window.electron = electronAPI
//   // @ts-ignore (define in dts)
//   window.api = api
// }
