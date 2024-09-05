import { createContext, useContext, useState } from 'react'

type securityProps = {
    textPassword: string,
    setTextPassword: (a: string) => void
    confirmed: boolean
    setConfirmed: (a: boolean) => void
    showSecurity: boolean
    setShowSecurity: (a: boolean) => void
}

const SecurityContext = createContext<securityProps>({} as securityProps)
let win: any = window

export const SecurityWrapper = ({ children }) => {

    const [textPassword, setTextPassword] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [showSecurity, setShowSecurity] = useState(false)

    return (
        <SecurityContext.Provider value={{ textPassword, setTextPassword, confirmed, setConfirmed, showSecurity, setShowSecurity }}>
            {children}
        </SecurityContext.Provider>
    )
}

export const useSecurity = () => useContext(SecurityContext)
