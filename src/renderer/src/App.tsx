import { useCallback, useEffect, useState } from 'react'
import Routes from './Router'
import { Header } from './components/header'
import { Navbar } from './components/navbar'
import { Notification } from './components/notification'
import CreateAccount from './page/CreateAccount'
import { Loading } from './components/loading'


const win: any = window
function App(): JSX.Element {
  const [showNotification, setShowNotification] = useState(false);
  const [load, setLoad] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>()
  
  const refreshAndStorageToken = useCallback(async () => {
    setLoad(true)
    await win.api.initialMain()
    await win.api.initialRender(data => {
      setIsAuthorized(data)
    })
    setLoad(false)

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
      {
        isAuthorized ?
        <>
          <Navbar/>
          <Header />
          <Routes />
        </>
        :
        <>
          <Header />
          <CreateAccount/>
        </>
      }

{
                load &&
                <Loading />
            }

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