import { AccountWrapper } from './context/account.context'
import { SecurityWrapper } from './context/security.context'
import Layout from './page/Layout'

function App(): JSX.Element {
  return (
    <AccountWrapper>
      <SecurityWrapper>
        <Layout />
      </SecurityWrapper>
    </AccountWrapper>
  )
}

export default App
