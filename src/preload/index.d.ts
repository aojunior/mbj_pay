// import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: unknown
    electronAPI: any
    api: unknown
  }
}
