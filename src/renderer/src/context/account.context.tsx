import { Client } from '@prisma/client'
import { bankSchema, companySchema, ownerSchema } from '@renderer/page/Account/schema'
import { createContext, useContext, useState } from 'react'
import { z } from 'zod'

type accountProps = Client
type accStateProps = {
  accState: accountProps | null
  setAccState: (a: accountProps | null) => void
  accData: accountProps | null
  setAccData: (a: accountProps | null) => void
  ownerData: z.infer<typeof ownerSchema>
  setOwnerData: (data: any) => void
  companyData: z.infer<typeof companySchema>
  setCompanyData: (data: any ) => void
  bankData: z.infer<typeof bankSchema>
  setBankData: (data: any) => void

  setAccount: (data: accountProps) => Promise<void>
  getAccount: () => Promise<accountProps>
  delAccount: () => Promise<void>
}

const AccountContext = createContext<accStateProps>({} as accStateProps)

export const AccountWrapper = ({ children }) => {
  const [accState, setAccState] = useState({} as accountProps | null)
  const [accData, setAccData] = useState({} as accountProps | null)
  const [ownerData, setOwnerData] = useState({} as z.infer<typeof ownerSchema>)
  const [companyData, setCompanyData] = useState({} as z.infer<typeof companySchema>)
  const [bankData, setBankData] = useState({} as z.infer<typeof bankSchema>)

  async function setAccount(data) {
    await window.localStorage.setItem('account', JSON.stringify(data))
    setAccData(data)
  }
  async function getAccount() {
    const acc  = await window.localStorage.getItem('account')
    if (!acc) return setAccData(null)
    let parse = JSON.parse(acc)
    setAccData(parse)
    return parse
  }
  async function delAccount() {
    await window.localStorage.removeItem('account')
    setAccData(null)
  }

  return (
    <AccountContext.Provider value={{ 
      accState, setAccState, accData, setAccData,
      ownerData, setOwnerData,
      companyData, setCompanyData,
      bankData, setBankData,
      setAccount, getAccount, delAccount
    }}>{children}</AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
