import { is } from '@electron-toolkit/utils'

let DirectoryName: string = ''
if(is.dev) {
    DirectoryName = 'work\mbj_pay';
} else {
    DirectoryName = 'clientPix';
}

export const appDirectoryName = 'clientPix';
export const fileEncoding: BufferEncoding = 'utf8';