import CreateAccount from '@renderer/page/Account'
import { Finalization } from '@renderer/page/Account/_components/finalization'
import { SignIn } from '@renderer/page/Account/_components/signIn'
import { TermsOfUse } from '@renderer/page/Account/_components/termOfUse'
import Dashboard from '@renderer/page/Dashboard'
import Home from '@renderer/page/Home/Index'
import Settings from '@renderer/page/Settings'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { AppLayout } from '@renderer/page/Layout'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from '@renderer/context/account.context'
import { useNotification } from '@renderer/context/notification.context'
import { FormCompany } from '@renderer/page/Account/_components/formCompany'
import { FormOwner } from '@renderer/page/Account/_components/formOwner'
import { FormBank } from '@renderer/page/Account/_components/formBank'
import { Loading } from '@renderer/components/loading'

const win: any = window
export default function Root(): JSX.Element {
  const navigate = useNavigate()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setAccState, getAccount } = useAccount()
  const [isLoad, setIsLoad] = useState<boolean>(true)

  //Refresh Token in 5 minutes and storage in SessionStorage
  const refreshAndStorageToken = useCallback(async () => {
    const newToken = await win.api.tokenGenerator()
    if (!newToken.data) {
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Houve um Erro',
        message: newToken.message
      })
      setShowNotification(true)
    } else {
      sessionStorage.setItem('token', newToken.data)
    }
  }, [])

  useEffect(() => {
    refreshAndStorageToken()
    setInterval(() => refreshAndStorageToken(), 5000 * 60)
  }, [refreshAndStorageToken])
  
  useEffect(() => {
    const checkClient = async () => {
      const data = await getAccount()
      if (data?.accountId) {
        navigate('/home', { replace: true })
      } else {
        setAccState(null)
        navigate('/account/signin', { replace: true })
      }
      setIsLoad(false)
    }
    checkClient()
  }, [])

  if(isLoad) {
    return <Loading />
  }
  
  return (
    <Routes>
      <Route element={<CreateAccount />} >
          <Route path="/" element={<SignIn />} />
          <Route path="/account/signin" element={<SignIn />} />
          <Route path="/account/create" element={<CreateAccount />} />
          <Route path="/account/terms" element={<TermsOfUse />} />
          <Route path="/account/company" element={<FormCompany />} />
          <Route path="/account/owner" element={<FormOwner /> } />
          <Route path="/account/bank" element={<FormBank />} />
          <Route path="/account/complete" element={<Finalization />} />
      </Route>
    
      <Route element={<AppLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}