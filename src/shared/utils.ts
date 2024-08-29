import crypto from "crypto";
import cryptoJs from 'crypto-js'

export const formatDate = (date: Date) => {
  if(date !== undefined) {
    let d = date.toISOString().split('T')
    let format = d[0].split('-')
    return format[2] + '/' + format[1] + '/' + format[0]
  }
}

export const formatCNPJandCPF = (data: string) => {
  if (data?.length > 11) {
    let cnpj = data.replace(/\D/g, '')
    return cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else {
    let cpf = data?.replace(/\D/g, '')
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
}

export const maskCurrencyInput = (event) => {
  let value = event.target.value;

  // Remove todos os caracteres que não sejam números
  value = value.replace(/\D/g, '');

  // Converte para número e formata como moeda
  value = (Number(value) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  event.target.value = value;
}

export const today = new Date().toISOString().split('T')[0]

//  FUNCTIONS UTILITARIES
export function HashConstructor(password: string) {
  const saltKey = crypto.randomBytes(32).toString('hex')
  let concat = password + saltKey
  let hashPassword = cryptoJs.SHA256(concat)
  return {
      saltKey: saltKey,
      hashPassword: hashPassword.toString(cryptoJs.enc.Hex)
  }
}

export function HashComparator(password: string, data: any) {
  let concat = password + data.saltKey
  let hash = cryptoJs.SHA256(concat)
  if(hash.toString(cryptoJs.enc.Hex) !== data.hashPassword) {
    return false
  }
  return true
}
