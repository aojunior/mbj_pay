/* eslint-disable prettier/prettier */
import { z } from 'zod'

export const companySchema = z.object({
  companyName: z.string(),
  companyFantasyName: z.string(),
  companyDocument: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido. Use o formato 00.000.000/0000-00'),
  companyDateCreated: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida, use o formato DD/MM/AAAA'),
  companyEmailAddress: z.string(),
  companyPhoneNumber: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Telefone inválido. Use o formato (00) 0000-0000 ou (00) 00000-0000'
    ),
  companyAddress: z.string(),
  companyAddressNumber: z.string(),
  companyAddressComplement: z.string(),
  companyNeighborhood: z.string(),
  companyCity: z.string(),
  companyState: z.string(),
  companyZipCode: z.string().regex(/^([\d]{5})-*([\d]{3})$/, 'Formato inválido, use 00000-000')
})

export const ownerSchema = z.object({
  ownerName: z.string(),
  ownerDocument: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato 000.000.000-00'),
  ownerMotherName: z.string(),
  ownerEmailAddress: z.string(),
  ownerBirthday: z.string(),
  ownerPhoneNumber: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Telefone inválido. Use o formato (00) 00000-0000'
    ),
  ownerAddress: z.string(),
  ownerAddressNumber: z.string(),
  ownerAddressComplement: z.string(),
  ownerNeighborhood: z.string(),
  ownerCity: z.string(),
  ownerState: z.string(),
  ownerZipCode: z.string().regex(/^([\d]{5})-*([\d]{3})$/, 'Formato inválido, use 00000-000')
})

export const bankSchema = z.object({
  imgSelfie: z.string(),
  imgRgFront: z.string().optional(),
  imgRgBack: z.string().optional(),
  imgCnh: z.string().optional(),
  pdfContrato: z.string(),
  password: z.string().min(4)
})

export const signInSchema = z.object({
  taxId: z.string(),
  password: z.string().min(4)
})