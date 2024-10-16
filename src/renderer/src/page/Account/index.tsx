import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Progress } from './_components/Progress'
import { Button, ContentInRow } from '../../styles/global'
import { Notification } from '@renderer/components/notification'
import { Loading } from '@renderer/components/loading'
import { useNotification } from '@renderer/context/notification.context'
import { useAccount } from '@renderer/context/account.context'
import { Header } from '@renderer/components/header'
import { delay } from '@shared/utils'
import { useLoading } from '@renderer/context/loading.context'

const win: any = window

export default function CreateAccount() {
  const { companyData, bankData, ownerData } = useAccount()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setIsLoading } = useLoading()
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
      setContentNotification({
        ...contentNotification,
        title: "Necessário criar uma Senha",
        message: 'Por favor, preencha o campo de senha com no mínimo 4 caracteres',
        type: 'error'
      })
      setShowNotification(true)
      return
    }

    setIsLoading(true)
    const formatDateForSubmission = (date) => {
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    }

    const concatAccount = { ...companyData, ...ownerData, ...bankData }
    concatAccount.companyDocument = companyData.companyDocument.replace(/\D/g, '')
    concatAccount.companyDateCreated = formatDateForSubmission(companyData.companyDateCreated)
    concatAccount.companyPhoneNumber = companyData.companyPhoneNumber.replace(/\D/g, '')
    concatAccount.companyZipCode = companyData.companyZipCode.replace(/\D/g, '')
    
    concatAccount.ownerBirthday = formatDateForSubmission(ownerData.ownerBirthday)
    concatAccount.ownerDocument = ownerData.ownerDocument.replace(/\D/g, '')
    concatAccount.ownerPhoneNumber = ownerData.ownerPhoneNumber.replace(/\D/g, '')
    concatAccount.ownerZipCode = ownerData.ownerZipCode.replace(/\D/g, '')
    
    // Formato para 11 dígitos: 9999999-9999
    concatAccount.ownerPhoneNumber = concatAccount.ownerPhoneNumber.replace(/^(\d{7})(\d{4})$/, '$1-$2');
    
    concatAccount.imgSelfie =  String(concatAccount.imgSelfie).replace('data:image/jpeg;base64,', '')
    concatAccount.imgRgFront =  String(concatAccount.imgRgFront).replace('data:image/jpeg;base64,', '')
    concatAccount.imgRgBack =  String(concatAccount.imgRgBack).replace('data:image/jpeg;base64,', '')

    let resp = await win.api.createAccount(concatAccount)
    
    if (resp.message == 'SUCCESS') {
      setContentNotification({
        ...contentNotification,
        title: 'Solicitação enviada com sucesso!',
        message: 'Sua conta foi enviada para analise com sucesso!',
        type: 'success',
      })
      setShowNotification(true)
      await localStorage.setItem('accID', resp.data.accountId)
      await win.api.logger({type: 'info', message:'Request Account successfully'})
      delay(2000)
      navigate('/account/complete', { replace: true })
    } else {
      setContentNotification({
        ...contentNotification,
        title: 'Houve um Erro',
        message: resp.message,
        type: 'error'
      })
      setShowNotification(true)
    }
    setIsLoading(false)
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
      <Loading />
      <Notification />
    </div>
  )
}
