import { appDirectoryName, fileEncoding } from "@shared/constants";
import { readdir, readFile, unwatchFile, watchFile } from "fs";
import { ensureDir, existsSync, mkdir } from "fs-extra";
import { homedir } from "os";

let file = {}

export const getRootDirectory = () => {
    return `C:/${appDirectoryName}`
};

export const createPath = () => {
    const rootDir = getRootDirectory();
    const ReqPath = rootDir+'/Req';
    const ResPath = rootDir+'/Res'
    const PrintPath = rootDir+'/Print'
    if(!existsSync(rootDir)|| !existsSync(ReqPath) || !existsSync(ResPath) || !existsSync(PrintPath) ){
        console.log(`Creating path ...`);
        Promise.all(
            [mkdir(rootDir),
            mkdir(ReqPath),
            mkdir(ResPath),
            mkdir(PrintPath)]
        ).catch((err) => console.error(err));
    }   
} 

export const watchFileAndFormat = async (callback:(formatData: any) => void) => {
    const rootDir = getRootDirectory();
    await ensureDir(rootDir);
    const ReqFile = rootDir+'/Req/001.int';

    const watcher = await watchFile(ReqFile, async (curr) => {
        // console.log(`Read File: ${curr.isFile()}`);
        if(curr.isFile()) {
            await readFile(ReqFile, fileEncoding, (err, data) => {
                if(err) throw err;
                const linesUnformatted = data.split('\n');
                // if send order correctly
                const line0 = linesUnformatted[0].split('='); //type file
                const line1 = linesUnformatted[1].split('=') //order Number
                const line2 = linesUnformatted[2].split('=') //order value
                const line3 = linesUnformatted[3].split('=') //pix format
                const line4 = linesUnformatted[4] //file end

                const filePath = {
                    fileType: line0[1].trim(),
                    orderNumber: line1[1].trim(),
                    orderValue: line2[1].trim(),
                    pixFormat: line3[1].trim(),
                    filEnd: line4,
                };

                if(filePath.fileType === '1') {
                    return callback(filePath);
                };

                if(filePath.fileType === '0') {

                };
            });
        } else {
            return callback(null);
        }
    });

    return () => {
        unwatchFile(ReqFile);
        // watcher.close();
    }
};