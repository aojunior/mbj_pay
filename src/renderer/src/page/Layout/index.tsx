import { Notification } from '@renderer/components/notification'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Loading } from '@renderer/components/loading'
import { Navbar } from '@renderer/components/navbar'
import { Header } from '@renderer/components/header'
import { useAccount } from '@renderer/context/account.context'
import { useNotification } from '@renderer/context/notification.context'

import Root from '@renderer/router'
import { Progress } from '../Account/_components/Progress'
import { Button, Container, ContentInRow } from '@renderer/styles/global'

const win: any = window

// export default function Layout() {
//   const { contentNotification, setContentNotification, setShowNotification } = useNotification()
//   const { accState, setAccState } = useAccount()
//   // const [showNotification, setShowNotification] = useState(false)
//   const [isLoad, setIsLoad] = useState<boolean>(false)
//   const navigate = useNavigate()

//   //Refresh Token in 5 minutes and storage in SessionStorage
//   const refreshAndStorageToken = useCallback(async () => {
//     const newToken = await win.api.tokenGenerator()
//     if (newToken == undefined || newToken == null) {
//       setContentNotification({
//         ...contentNotification,
//         type: 'error',
//         title: 'Error Connecting to server',
//         message: 'Error when trying to connect to the server'
//       })
//       setShowNotification(true)
//       throw new Error(`Access token not available`)
//     }
//     sessionStorage.setItem('token', newToken)
//   }, [])

//   useEffect(() => {
//     refreshAndStorageToken()
//     setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
//   }, [refreshAndStorageToken])

//   useEffect(() => {
//     const checkClient = async () => {
//       setIsLoad(true)
//       const exists = await win.api.getAccount()
//       if (exists) {
//         setAccState(exists)
//         navigate('/home')
//       } else {
//         setAccState(null)
//         navigate('/account/signin')
//       }
//       setIsLoad(false)
//     }
//     checkClient()
//   }, [])

//   return (
//     <div
//       style={{
//         width: '100vw',
//         alignItems: 'center',
//         display: 'flex',
//         flexDirection: 'column',
//         margin: 0,
//         padding: 0
//       }}
//     >
//       {isLoad && <Loading />}
//       {accState && <Navbar />}
//       <Header />
//       <Outlet />
//       <Notification />
//     </div>
//   )
// }

export function AccountLayout() {
  const { companyData, bankData, ownerData } = useAccount()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()

  const [ isLoad, setIsLoad ] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  function nextPage() {
    switch (location.pathname) {
      case '/account/terms':
        navigate('/account/company')
        break
      case '/account/company':
        navigate('/account/owner')
        break
      case '/account/owner':
        navigate('/account/bank')
        break
      case '/account/bank':
        navigate('/account/complete')
        break
    }
  }

  async function onSubmit() {
    if (bankData.password.length < 4) {
      setIsLoad(true)
      setContentNotification({
        ...contentNotification,
        title: "Necessário criar uma Senha",
        message: 'Por favor, preencha o campo de senha com no mínimo 4 caracteres',
        type: 'error'
      })
      setShowNotification(true)
      setIsLoad(false)
      return
    }
    setIsLoad(true)
    const formatDateForSubmission = (date) => {
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    }
    const concatAccount = { ...companyData, ...ownerData, ...bankData }
    concatAccount.companyDateCreated = formatDateForSubmission(companyData.companyDateCreated)
    concatAccount.companyDocument = companyData.companyDocument.replace(/\D/g, '')
    concatAccount.companyPhoneNumber = companyData.companyPhoneNumber.replace(/\D/g, '')

    concatAccount.ownerBirthday = formatDateForSubmission(ownerData.ownerBirthday)
    concatAccount.ownerDocument = ownerData.ownerDocument.replace(/\D/g, '')
    concatAccount.ownerPhoneNumber = ownerData.ownerPhoneNumber.replace(/\D/g, '')
    let resp = await win.api.createAccount(concatAccount)
    setIsLoad(false)
    if (resp == 1) {
      setContentNotification({
        ...contentNotification,
        title: 'Conta criada com sucesso!',
        message: 'Sua conta foi criada com sucesso!',
        type: 'confirm'
      })
      setShowNotification(true)
      setTimeout(() => navigate('/account/complete', { replace: true }), 2000)
    } else {
      setContentNotification({
        ...contentNotification,
        title: 'Erro!',
        message: 'Houve um erro ao tentar criar a conta, tente novamente!',
        type: 'error'
      })
      setShowNotification(true)
    }
  }
  
  return (
    <div
      style={{
        width: '100vw',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0
      }}
    >
      <Header />
      { location.pathname !== '/' && location.pathname !== '/account/signin' &&
        <Progress />}
    
        <Outlet />

      { location.pathname !== '/' && location.pathname !== '/account/signin' &&
        <ContentInRow
          style={
            location.pathname === '/account/terms' ? { display: 'none' } : { width: '90%' }
          }
        >
          <Button onClick={() => navigate(-1)}> Voltar </Button>
          
          {location.pathname !== '/account/bank' && location.pathname !== '/account/complete' ? (
            <Button onClick={nextPage}> Continuar </Button>
          ) : location.pathname == '/account/bank' && (
            <Button onClick={onSubmit}> Finalizar </Button>
          )}
        </ContentInRow>
      }
      {isLoad && <Loading />}
      <Notification />
    </div>
  )
}

export function AppLayout() {

  return (
  <div
      style={{
        width: '100vw',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0
      }}
    >
      {<Navbar />}
      <Header />
      <Outlet />
      <Notification />
    </div>
  )
}