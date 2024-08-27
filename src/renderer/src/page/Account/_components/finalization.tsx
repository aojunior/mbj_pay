import { Notification } from '@renderer/components/notification'
import { useState } from 'react'
import { Container, Message, Title } from '../styles'
import { Button } from '@renderer/styles/global'
import { Loading } from '@renderer/components/loading'

const win: any = window
export function Finalization() {

  const [notification, setNotification] = useState({
    message: '',
    type: '' as 'error' | 'warning' | 'info' | 'confirm' | 'custom'
  })
  const [showNotification, setShowNotification] = useState(false)
  const [isLoad, setIsLoad] = useState(false)

  async function handleVerifyAccount() {
    setIsLoad(true)
    const verify = await win.api.verifyAccount()
    setIsLoad(false)

    if (verify == 'UPDATED') {
      setNotification({
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
          height: '60vh'
        }}
      >
        <Title>Finalização do Cadastro</Title>
        <Message>
          Verifique sua conta para concluir o cadastro. O processo de validação pode demorar até 10
          minutos.
        </Message>
        <Button style={{ width: 150 }} onClick={handleVerifyAccount}>
          Verificar Conta
        </Button>

        <Notification
          message={notification.message}
          show={showNotification}
          type={notification.type}
          onClose={() => setShowNotification(!showNotification)}
        />
      </Container>
    </>
  )
}
