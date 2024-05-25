// eslint-disable-next-line prettier/prettier
import { Header } from './components/header'
import Home from './page/Home/Index'
import CreateAccount from './page/CreateAccount'
import Dashboard from './page/Dashboard'
import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

function App(): JSX.Element {
  function refreshAndStorageToken() {
    console.log('refresh Token')
    window.api.tokenGenerator()
    window.api.accessToken(data => sessionStorage.setItem('token', data))      
  }

  useEffect(() => {
    refreshAndStorageToken()
    setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
  }, [])

  return (
    <div style={{width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column',}}>
      <Header />
      <Home />

    </div>
  )
}


export default App
