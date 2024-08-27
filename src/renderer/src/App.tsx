import { AccountWrapper } from './context/account.context'
import Layout from './page/Layout'

function App(): JSX.Element {
  return (
    <AccountWrapper>
      <Layout />
    </AccountWrapper>
  )
}

export default App
