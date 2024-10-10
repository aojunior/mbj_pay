import { Notification } from '@renderer/components/notification'
import { useState } from 'react'
import {  Message, Title } from '../styles'
import { Button, Container } from '@renderer/styles/global'
import { Loading } from '@renderer/components/loading'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window
export function Finalization() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [isLoad, setIsLoad] = useState(false)
 
  async function handleVerifyAccount() {
    setIsLoad(true)
    const verify = await win.api.verifyAccount()
    setIsLoad(false)

    if (verify == 'UPDATED') {
      setContentNotification({
        ...contentNotification,
        title: 'Conta Verificada',
        message: 'Sua conta foi verificada com sucesso!',
        type: 'info'
      })
      setShowNotification(true)
      setTimeout(() => window.location.reload(), 2000)
    }
  }

  return (
    <>
      {isLoad && <Loading />}
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          height: '84vh'
        }}
      >
        <Title>Finalização do Cadastro</Title>
        <Message>
          Verifique sua conta para concluir o cadastro. O processo de validação pode demorar até 30 minutos.
        </Message>
        <Button style={{ width: 150 }} onClick={handleVerifyAccount}>
          Verificar Conta
        </Button>
      </Container>
    </>
  )
}
