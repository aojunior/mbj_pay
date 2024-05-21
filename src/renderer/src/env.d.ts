/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly MAIN_VITE_SOME_KEY: string
    readonly VITE_URL: string
    readonly VITE_CLIENTEID: string
    readonly VITE_CLIENTSECRET: string
    readonly VITE_SECRETKEY: string
    readonly VITE_CERTIFICATECRT: string
    readonly VITE_CERTIFICATEKEY: string
    readonly VITE_ACCOUNTID: string
    readonly VITE_HASH: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }