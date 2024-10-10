export const appDirectoryName = process.platform == 'linux' ? 'clientPix' : 'C:/clientPix'
export const fileEncoding: BufferEncoding = 'utf8'

export type fileProps = {
  fileType: string
  orderID: string
  totalAmount: number
  customerID: string
  recipientComment: string
  filEnd: string
}
