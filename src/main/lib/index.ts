import { appDirectoryName } from "@shared/constants";
import { readdir } from "fs";
import { ensureDir, existsSync, mkdir, watchFile } from "fs-extra";
import { homedir } from "os";


export const getRootDirectory = () => {
    return `C:/${appDirectoryName}`
};

export const createPath = () => {
    const rootDir = getRootDirectory();
    console.log('creating path')
    if(!existsSync(rootDir)|| !existsSync(rootDir+'/Req') || !existsSync(rootDir+'/Res') || !existsSync(rootDir+'/Print') ){
        console.log(`Creating path`);
        Promise.all(
            [mkdir(rootDir),
            mkdir(rootDir+'/Req'),
            mkdir(rootDir+'/Res'),
            mkdir(rootDir+'/Print')]
        ).catch((err) => console.error(err));
    }   
} 

export const getFileReq = async () => {
    const rootDir = getRootDirectory();
    await ensureDir(rootDir)
    // return file = ()
}