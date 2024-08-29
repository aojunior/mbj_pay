import { HashComparator } from '@shared/utils'
import { createContext, useContext, useState } from 'react'

type securityProps = {
    password: string,
    setPassword: (a: string) => void
    confirmed: boolean
    setConfirmed: (a: boolean) => void
    showSecurity: boolean
    setShowSecurity: (a: boolean) => void
}

const SecurityContext = createContext<securityProps>({} as securityProps)
let win: any = window
export const SecurityWrapper = ({ children }) => {
    const [password, setPassword] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [showSecurity, setShowSecurity] = useState(false)

    async function test() {
        const credentials = win.api.security()
        setConfirmed(await HashComparator(password, credentials))
    }

    return (
        <SecurityContext.Provider value={{ password, setPassword, confirmed, setConfirmed, showSecurity, setShowSecurity }}>
            {children}
        </SecurityContext.Provider>
    )
}

export const useSecurity = () => useContext(SecurityContext)
