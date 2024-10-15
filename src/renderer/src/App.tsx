import { AccountWrapper } from './context/account.context'
import { NotificationWrapper } from './context/notification.context'
import { SecurityWrapper } from './context/security.context'
import { UtilsProvider } from './context/utils.context'
// import Layout from './page/Layout'
import Root from './router'

function App(): JSX.Element {

  return (
    <AccountWrapper>
      <NotificationWrapper>
        <SecurityWrapper>
          <UtilsProvider>
            <Root />
          </UtilsProvider>
        </SecurityWrapper>
      </NotificationWrapper>
    </AccountWrapper>
  )
}

export default App
