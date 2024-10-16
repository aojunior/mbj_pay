import { createContext, useContext, useState } from 'react'

type LoadingProps = {
  isLoading: boolean
  setIsLoading: any
}

const LoadingContext = createContext<LoadingProps>({} as LoadingProps)

export const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }} >
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
