import { useCallback, useEffect } from 'react'
import Routes from './Router'
import { Header } from './components/header'
import { Navbar } from './components/Navbar'

const win: any = window
function App(): JSX.Element {
  const refreshAndStorageToken = useCallback(() => {
    win.api.tokenGenerator()
    win.api.accessToken(data => sessionStorage.setItem('token', data))      
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
    </div>
  )
}


export default App
