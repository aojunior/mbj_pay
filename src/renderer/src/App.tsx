import { Header } from './components/header'
import Home from './page/Home/Index'
import UserRegister from './page/UserRegister'

function App(): JSX.Element {
  return (
    <div style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <UserRegister/>

      <div className="creator">Powered by MBJ Informatica</div>
    {/* 
      <p className="tip">
      Powered by MBJ Informatica
        Please try pressing <code>F12</code> to open the devTool
      </p> */}

    </div>
  )
}

export default App
