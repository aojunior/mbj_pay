import hmac from 'js-crypto-hmac'
import axios from 'axios'
import https from 'https';
import { join } from 'path'
import { StringDecoder } from 'string_decoder'
import { readFileSync } from 'fs';
import { appDirectoryName, fileEncoding } from "./constants";

const client_id = import.meta.env.MAIN_VITE_CLIENTEID
const client_secret = import.meta.env.MAIN_VITE_CLIENTSECRET
const SecretKey = import.meta.env.MAIN_VITE_SECRETKEY
const accountid = import.meta.env.MAIN_VITE_ACCOUNTID

const certificate_pem = readFileSync(join(__dirname, '../')+'CERTIFICATES/client.crt')
const certificate_key = readFileSync(join(__dirname, '../')+'CERTIFICATES/client.key')
const certificate_ca = readFileSync(join(__dirname, '../')+'CERTIFICATES/rootCA.crt')

const headers = {
  'Accept-Encoding': 'gzip, deflate, br',
  connection: 'keep-alive',
  Accept: '*/*',
  'Content-Type': 'application/x-www-form-urlencoded',
  Host: 'mtls-mp.hml.flagship.maas.link'
}

function encrypt_string(hash_string: string) {
  const msg = new TextEncoder().encode(hash_string)
  const key = new TextEncoder().encode(SecretKey)
  const hash = 'SHA-256'

  const sha_signature = hmac.compute(key, msg, hash).then((hmac) => {
    return hmac
  })
  return console.log(sha_signature)
};

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: certificate_pem,
  key: certificate_key,
  ca: certificate_ca,
  host: 'mtls-mp.hml.flagship.maas.link',

});

const api = axios.create({
  baseURL: 'https://mtls-mp.hml.flagship.maas.link',
  headers,
  httpsAgent
})

export async function tokenGenerator() {
  let token = ''
  await api.post('/auth/realms/Matera/protocol/openid-connect/token',
    {
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret,
    },
  ).then((response) => {
    token = response.data.access_token
  }).catch(e => console.log(e))  
}

export async function createAccount() {
  
}