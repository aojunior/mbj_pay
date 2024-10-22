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
  cleanUpSecurity: () => void
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
    setTextPassword('')
    setShowSecurity(true)
    setSecurity({ ...security, context: context })
  }

  const cleanUpSecurity = () => {
    setTextPassword('')
    setShowSecurity(false)
    setSecurity({ confirmed: false, context: '' })
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
        callSecurityButton,
        cleanUpSecurity
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export const useSecurity = () => useContext(SecurityContext)
