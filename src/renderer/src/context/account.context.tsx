import { Client } from '@prisma/client'
import { bankSchema, companySchema, ownerSchema } from '@renderer/page/Account/schema'
import { createContext, useContext, useState } from 'react'
import { z } from 'zod'

type accountProps = Client

type accStateProps = {
  accState: accountProps | null
  setAccState: (a: accountProps | null) => void
  ownerData: z.infer<typeof ownerSchema>
  setOwnerData: (data: any) => void
  companyData: z.infer<typeof companySchema>
  setCompanyData: (data: any ) => void
  bankData: z.infer<typeof bankSchema>
  setBankData: (data: any) => void
}

const AccountContext = createContext<accStateProps>({} as accStateProps)

export const AccountWrapper = ({ children }) => {
  const [accState, setAccState] = useState({} as accountProps | null)
  const [ownerData, setOwnerData] = useState({} as z.infer<typeof ownerSchema>)
  const [companyData, setCompanyData] = useState({} as z.infer<typeof companySchema>)
  const [bankData, setBankData] = useState({} as z.infer<typeof bankSchema>)

  return (
    <AccountContext.Provider value={{ accState, setAccState, ownerData, setOwnerData, companyData, setCompanyData, bankData, setBankData }}>{children}</AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
