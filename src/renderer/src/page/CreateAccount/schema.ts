/* eslint-disable prettier/prettier */
import { z } from 'zod'

export const companySchema = z.object({
    companyName: z.string(),
    companyDocument: z.string(),
    companyDateCreated: z.string(),
    companyEmailAddress: z.string(),
    companyPhoneNumber: z.string(),
    companyPhoneNumber2: z.string().optional(),
    companyAddress: z.string(),
    companyAddressNumber: z.string(),
    companyAddressComplement: z.string(),
    companyNeighborhood: z.string(),
    companyCity: z.string(),
    companyState: z.string(),
    companyCodezip: z.string(),
})

export const ownerSchema = z.object({
    ownerName: z.string(),
    ownerDocument: z.string(),
    ownerMotherName: z.string(),
    ownerEmailAddress: z.string(),
    ownerBirthday: z.string(),
    ownerPhoneNumber: z.string(),
    ownerPhoneNumber2: z.string().optional(),
    ownerAddress: z.string(),
    ownerAddressNumber: z.string(),
    ownerAddressComplement: z.string(),
    ownerNeighborhood: z.string(),
    ownerCity: z.string(),
    ownerState: z.string(),
    ownerCodeZip: z.string(),
})

export const bankSchema = z.object({
    imgSelfie: z.string(),
    imgRgFrente: z.string(),
    imgRgverso: z.string()
})