import axios from "axios";
import 'dotenv/config';
import hmac from 'js-crypto-hmac'
import { api } from "./constants";
import { join } from 'path'
import { StringDecoder } from "string_decoder";

const client_id       = process.env.CLIENTEID;
const client_secret   = process.env.CLIENTSECRET;
const SecretKey       = process.env.SECRETKEY;
const accountid       = process.env.ACCOUNTID;

function getTuple() {
    const certificate_pem =  join(__dirname, '../') + process.env.CERTIFICATECRT
    const certificate_key = join(__dirname, '../') + process.env.CERTIFICATEKEY

    return [certificate_pem, certificate_key]
};

const [certificate_pem, certificate_key] = getTuple() 

let header = {
    'Accept-Encoding': 'gzip, deflate, br',
    'connection': 'keep-alive',
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'mtls-mp.hml.flagship.maas.link'
}

function encrypt_string(hash_string: string) {
    const msg =  new TextEncoder().encode(hash_string); 
    const key = new TextEncoder().encode(SecretKey); 
    const hash = 'SHA-256';

    let sha_signature = hmac.compute(key, msg, hash).then( (hmac) => {
        return hmac
    });
    return console.log(sha_signature)
};
