import axios from 'axios'
import 'dotenv/config'
import hmac from 'js-crypto-hmac'
import { api } from './constants'
import { join } from 'path'
import { StringDecoder } from 'string_decoder'

const client_id = import.meta.env.CLIENTEID
const client_secret = import.meta.env.CLIENTSECRET
const SecretKey = import.meta.env.SECRETKEY
const accountid = import.meta.env.ACCOUNTID

function getTuple() {
  const certificate_pem = join(__dirname, '../') + import.meta.env.CERTIFICATECRT
  const certificate_key = join(__dirname, '../') + import.meta.env.CERTIFICATEKEY

  return [certificate_pem, certificate_key]
}

const [certificate_pem, certificate_key] = getTuple()

const header = {
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
  // eslint-disable-next-line prettier/prettier
};

export async function tokenGenerator() {
  await api.post(
    '/auth/realms/Matera/protocol/penid-connect/token',
    {
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret
    },
    {
      headers: header
    }
  ).then((response) => {
    return console.log(response)
  }).catch(e => console.log(e))
}
