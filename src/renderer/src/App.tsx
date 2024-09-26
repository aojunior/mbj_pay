import { AccountWrapper } from './context/account.context'
import { NotificationWrapper } from './context/notification.context'
import { SecurityWrapper } from './context/security.context'
// import Layout from './page/Layout'
import Root from './router'

function App(): JSX.Element {
  return (
    <AccountWrapper>
      <NotificationWrapper>
        <SecurityWrapper>
          <Root />
        </SecurityWrapper>
      </NotificationWrapper>
    </AccountWrapper>
  )
}

export default App
