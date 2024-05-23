// eslint-disable-next-line prettier/prettier

import { Header } from './components/header'
import Home from './page/Home/Index'
import CreateAccount from './page/CreateAccount'
import Dashboard from './page/Dashboard'

function App(): JSX.Element {
  return (
    <div style={{width: '100vw', alignItems: 'center', display: 'flex', flexDirection: 'column',}}>
      <Header />
      <Home />
      {/* <CreateAccount/> */}
      {/* <Dashboard /> */}
    </div>
  )
}


export default App
