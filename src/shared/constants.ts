import { is } from '@electron-toolkit/utils'
import axios from "axios";
import 'dotenv/config';

const URL = process.env.URL;
let DirectoryName: string = '';

if(is.dev) {
    DirectoryName = 'work\mbj_pay';
} else {
    DirectoryName = 'clientPix';
}


export const appDirectoryName = 'clientPix';
export const fileEncoding: BufferEncoding = 'utf8';
export const api = axios.create({baseURL: URL, headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'connection': 'keep-alive',
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'mtls-mp.hml.flagship.maas.link'
}}
);

export type fileProps = {
    fileType: string,
    orderNumber: string,
    orderValue: number,
    pixFormat: string,
    filEnd: string,
};