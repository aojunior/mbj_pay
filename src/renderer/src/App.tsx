import { Loading } from './components/loading'
import { Notification } from './components/notification'
import { AccountWrapper } from './context/account.context'
import { LoadingWrapper } from './context/loading.context'
import { NotificationWrapper } from './context/notification.context'
import { SecurityWrapper } from './context/security.context'
import { UtilsProvider } from './context/utils.context'
// import Layout from './page/Layout'
import Root from './router'

function App(): JSX.Element {

  return (
    <LoadingWrapper>
      <AccountWrapper>
        <NotificationWrapper>
          <SecurityWrapper>
            <UtilsProvider>
              <Notification />
              <Loading />
              <Root />
            </UtilsProvider>
          </SecurityWrapper>
        </NotificationWrapper>
      </AccountWrapper>
    </LoadingWrapper>
  )
}

export default App
