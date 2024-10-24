import crypto from 'crypto'
import cryptoJs from 'crypto-js'

const date = new Date()
export const formatDate = (date: Date) => {
  if (date !== undefined) {
    let d = date.toISOString().split('T')
    let format = d[0].split('-')
    return format[2] + '/' + format[1] + '/' + format[0]
  } else {
    return
  }
}

// Função nativa para formatar a data
export const formatDateTime = (date) => {
  const pad = (n) => (n < 10 ? '0' + n : n);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Mês é zero-indexado
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const formatCNPJandCPF = (data: string) => {
  if (data?.length > 11) {
    let cnpj = data.replace(/\D/g, '')
    return cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else {
    let cpf = data?.replace(/\D/g, '')
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
}

export const formatPhoneInput = (event) => {
  let value = event.replace(/\D/g, '')
  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3')
  } else {
    value = value.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3')
  }
  return value
}

export const maskCurrencyInput = (event) => {
  let value = event.target.value
  value = value.replace(/\D/g, '')
  value = (Number(value) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  event.target.value = value
}

export const today = new Date().toISOString().split('T')[0]
export const currentTime = date.toLocaleTimeString('pt-br')

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
  if (hash.toString(cryptoJs.enc.Hex) !== data.hashPassword) {
    return false
  }
  return true
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}