import { useCallback, useEffect, useState } from 'react'
import Routes from './Router'
import { Header } from './components/header'
import { Navbar } from './components/navbar'
import { Notification } from './components/notification'

const win: any = window
function App(): JSX.Element {
  const [showNotification, setShowNotification] = useState(false);
  
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

  return (
    <div style={{width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column',}}>
      <Navbar/>
      <Header />
      <Routes />
      <Notification 
      type='error'
      show={showNotification}
      onClose={() => setShowNotification(!showNotification)}
      message="Error when trying to connect to the server" 
      />
    </div>
  )
}

export default App