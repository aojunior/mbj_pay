/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_SOME_KEY: string
  readonly MAIN_VITE_URL: string
  readonly MAIN_VITE_CLIENTEID: string
  readonly MAIN_VITE_CLIENTSECRET: string
  readonly MAIN_VITE_SECRETKEY: string
  readonly MAIN_VITE_CERTIFICATECRT: string
  readonly MAIN_VITE_CERTIFICATEKEY: string
  readonly MAIN_VITE_ACCOUNTID: string
  readonly MAIN_VITE_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}