import { Header } from './components/header'
import Home from './page/Home/Index'
import UserRegister from './page/UserRegister'

function App(): JSX.Element {
  return (
    <div style={{width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column',}}>
      <Header />
      <UserRegister/>
    </div>
  )
}

export default App
