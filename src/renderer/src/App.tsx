import { useCallback, useEffect } from 'react'
import Routes from './Router'
import { Header } from './components/header'
import { MenuBar } from './components/menubar/MenuBar'

function App(): JSX.Element {
  const refreshAndStorageToken = useCallback(() => {
    (window as any).api.tokenGenerator()
    (window as any).api.accessToken(data => sessionStorage.setItem('token', data))      
  }, [])

  useEffect(() => {
  //   refreshAndStorageToken()
  //   setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
  }, [refreshAndStorageToken])

  return (
    <div style={{width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column',}}>
      <MenuBar />
      <Header />
      <Routes />
    </div>
  )
}


export default App
