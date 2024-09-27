import CreateAccount from '@renderer/page/Account'
import { Finalization } from '@renderer/page/Account/_components/finalization'
import { SignIn } from '@renderer/page/Account/_components/formSignIn'
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
    const { setAccState } = useAccount()
    // const [showNotification, setShowNotification] = useState(false)
    const [isLoad, setIsLoad] = useState<boolean>(false)

    //Refresh Token in 5 minutes and storage in SessionStorage
    const refreshAndStorageToken = useCallback(async () => {
        const newToken = await win.api.tokenGenerator()
        if (newToken == undefined || newToken == null) {
        setContentNotification({
            ...contentNotification,
            type: 'error',
            title: 'Error Connecting to server',
            message: 'Error when trying to connect to the server'
        })
        setShowNotification(true)
        throw new Error(`Access token not available`)
        }
        sessionStorage.setItem('token', newToken)
    }, [])

    useEffect(() => {
        refreshAndStorageToken()
        setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
    }, [refreshAndStorageToken])
    
    useEffect(() => {
      const checkClient = async () => {
        setIsLoad(true)
        const exists = await win.api.getAccount()
        if (exists) {
          setAccState(exists)
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
      <Loading />
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