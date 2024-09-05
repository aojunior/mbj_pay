import { Notification } from '@renderer/components/notification'
import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from '@renderer/page/Home/Index'
import Dashboard from '@renderer/page/Dashboard'
import Settings from '@renderer/page/Settings'
import CreateAccount from '@renderer/page/Account'
import { TermsOfUse } from '@renderer/page/Account/_components/termOfUse'
import { Loading } from '@renderer/components/loading'
import { Navbar } from '@renderer/components/navbar'
import { Header } from '@renderer/components/header'
import { Finalization } from '../Account/_components/finalization'
import { useAccount } from '@renderer/context/account.context'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window
function Root(): JSX.Element {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/finalization" element={<Finalization />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default function Layout() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setAccState, accState } = useAccount()
  // const [showNotification, setShowNotification] = useState(false)
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const navigate = useNavigate()

  //Refresh Token in 5 minutes and storage in SessionStorage 
  const refreshAndStorageToken = useCallback(async () => {
    const newToken = await win.api.tokenGenerator()
    if (newToken == undefined || newToken == null) {
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Error Connecting to server',
        message: 'Error when trying to connect to the server'
      })
      setShowNotification(true)
      throw new Error(`Access token not available`)
    }
    sessionStorage.setItem('token', newToken)
  }, [])

  useEffect(() => {
    refreshAndStorageToken()
    setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
  }, [refreshAndStorageToken])

  useEffect(() => {
    const checkClient = async () => {
      setIsLoad(true)
      const exists = await win.api.getAccount()
      if (exists) {
        setAccState(exists)
        navigate('/home')
      } else {
        navigate('/terms')
      }
      setIsLoad(false)
    }
    checkClient()
  }, [])

  return (
    <div style={{ width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column', margin:0, padding:0 }}>
      {isLoad && <Loading />}
      {accState && <Navbar />}
      <Header />
      <Root />
      <Notification />
    </div>
  )
}
