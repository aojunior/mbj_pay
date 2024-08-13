import { createContext, useContext, useState} from 'react'

type accountProps = {
    AccountId: string,
    AccountHolderId: string,
    Account: string,
    Branch: string,
    Cnpj: string,
    Phone: string,
    CreatedAT: string,
    Status: string
}

type accStateProps = {
    accState: accountProps,
    setAccState: (a: accountProps) => void
}

const AccountContext = createContext<accStateProps>({} as accStateProps)


export const AccountWrapper = ({ children }) => {
    const [accState, setAccState] = useState({} as accountProps)
    
    return (
        <AccountContext.Provider value={{accState, setAccState}}>
            {children}
        </AccountContext.Provider>
    )
}


export const useAccount = () => useContext(AccountContext)