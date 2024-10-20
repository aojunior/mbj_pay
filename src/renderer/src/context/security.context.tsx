import { createContext, useContext, useState } from 'react'

type securityProps = {
  textPassword: string
  setTextPassword: (a: string) => void
  security: {
    context: string
    confirmed: boolean
  }
  setSecurity: (a: { context: string; confirmed: boolean }) => void
  showSecurity: boolean
  setShowSecurity: (a: boolean) => void
  callSecurityButton: (a: string) => void
}

const SecurityContext = createContext<securityProps>({} as securityProps)

export const SecurityWrapper = ({ children }) => {
  const [textPassword, setTextPassword] = useState('')
  const [security, setSecurity] = useState({
    context: '',
    confirmed: false
  })
  const [showSecurity, setShowSecurity] = useState(false)

  const callSecurityButton = (context) => {
    setSecurity({ context: '', confirmed: false })
    setShowSecurity(true)
    setSecurity({ ...security, context: context })
  }

  return (
    <SecurityContext.Provider
      value={{
        textPassword,
        setTextPassword,
        security,
        setSecurity,
        showSecurity,
        setShowSecurity,
        callSecurityButton
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export const useSecurity = () => useContext(SecurityContext)
