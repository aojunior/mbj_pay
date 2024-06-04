// import { is } from '@electron-toolkit/utils'

// const URL = import.meta.env.URL
// let DirectoryName: string

// if (is.dev) {
//   DirectoryName = 'workmbj_pay'
// } else {
//   DirectoryName = 'clientPix'
// }

export const appDirectoryName = 'clientPix'
export const fileEncoding: BufferEncoding = 'utf8'


export type fileProps = {
  fileType: string
  orderID: string
  totalAmount: number
  customerID: string
  recipientComment: string
  filEnd: string
}
