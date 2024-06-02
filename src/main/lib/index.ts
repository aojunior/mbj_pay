import { appDirectoryName, fileEncoding } from "@shared/constants";
import { readFile, unwatchFile, watchFile } from "fs";
import { ensureDir, existsSync, mkdir } from "fs-extra";

export const getRootDirectory = () => {
    return `${appDirectoryName}`
};

export const createPath = () => {
    const rootDir = getRootDirectory();
    const ReqPath = rootDir+'/Req';
    const ResPath = rootDir+'/Res'
    const PrintPath = rootDir+'/Print'
    if(!existsSync(ReqPath) || !existsSync(ResPath) || !existsSync(PrintPath) ){
        console.log(`Creating path ...`);
        Promise.all(
            [
            mkdir(ReqPath),
            mkdir(ResPath),
            mkdir(PrintPath)]
        ).then(() => console.log(`Succssesfull `)).catch((err) => console.error('Error: ', err));
    }   
} 

export const watchFileAndFormat = async (callback:(formatData: any) => void) => {
    const rootDir = getRootDirectory();
    await ensureDir(rootDir);
    const ReqFile = rootDir+'/Req/001.int';

    await watchFile(ReqFile, async (curr) => {
        // console.log(`Read File: ${curr.isFile()}`);
        if(curr.isFile()) {
            await readFile(ReqFile, fileEncoding, (err, data) => {
                if(err) throw err;
                const linesUnformatted = data.split('\n');
                // if send order correctly
                const line0 = linesUnformatted[0].split('=') // type file
                const line1 = linesUnformatted[1].split('=') // order id
                const line2 = linesUnformatted[2].split('=') // total amount
                const line3 = linesUnformatted[3].split('=') // customer id
                const line4 = linesUnformatted[4].split('=') // comments
                const line5 = linesUnformatted[5] //file end

                const filePath = {
                    fileType: line0[1].trim(),
                    orderID: line1[1].trim(),
                    totalAmount: line2[1].trim(),
                    customerID: line3[1].trim(),
                    recipientComment: line4[1].trim(),
                    filEnd: line5,
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
