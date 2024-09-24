import { Client } from '@prisma/client'
import { createContext, useContext, useState } from 'react'

type accountProps = Client

type accStateProps = {
  accState: accountProps | null
  setAccState: (a: accountProps | null) => void
}

const AccountContext = createContext<accStateProps>({} as accStateProps)

export const AccountWrapper = ({ children }) => {
  const [accState, setAccState] = useState({} as accountProps | null)

  return (
    <AccountContext.Provider value={{ accState, setAccState }}>{children}</AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
