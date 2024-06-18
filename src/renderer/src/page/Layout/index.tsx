import { Notification } from '@renderer/components/notification';
import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from '@renderer/page/Home/Index';
import Dashboard from '@renderer/page/Dashboard';
import Settings from '@renderer/page/Settings';
import CreateAccount from '@renderer/page/Account';
import { TermsOfUse } from '@renderer/page/Account/_components/termOfUse';
import { Loading } from '@renderer/components/loading';
import { MdAccountBalance } from 'react-icons/md';
import { Navbar } from '@renderer/components/navbar';
import { Header } from '@renderer/components/header';
import { Finalization } from '../Account/_components/finalization';

const win: any = window
 function Root(): JSX.Element {
  return (
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/create-account" element={<CreateAccount/>} />
      <Route path="/terms" element={<TermsOfUse/>} />
      <Route path="/finalization" element={<Finalization/>} />
      <Route path="/settings" element={<Settings/>} />
    </Routes>
  )
}

export default function Layout() {
  const [showNotification, setShowNotification] = useState(false);
  const [clientExists, setClientExists] = useState<boolean>(false)
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const navigate = useNavigate()

  const refreshAndStorageToken = useCallback(async () => {
    win.api.tokenGenerator()
    win.api.accessToken(data => {
      if(data == undefined || data == null) {
        setShowNotification(true)
        throw new Error(`Access token not available`)
      }
      sessionStorage.setItem('token', data)
    })    
  }, [])

  useEffect(() => {
    refreshAndStorageToken()
    setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
  }, [refreshAndStorageToken])

  useEffect(() => {
    const checkClient = async () => {
      setIsLoad(true)
      const exists = await win.api.checkClient()
      setClientExists(exists)
  
      if(exists) {
        navigate('/home')
      } else {
        navigate('/terms')
      }
      setIsLoad(false)
    }
    checkClient()
  }, [])

  return (
    <div style={{width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column',}}>
      { isLoad && <Loading /> }
      { clientExists && <Navbar /> }
      
      <Header />
      <Root />
      <Notification
      type='error'
      show={showNotification}
      onClose={() => setShowNotification(!showNotification)}
      message="Error when trying to connect to the server" 
      /> 
    </div>
  )
}