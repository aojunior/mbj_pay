import {  Message, Title } from '../styles'
import { Button, Container } from '@renderer/styles/global'
import { useNotification } from '@renderer/context/notification.context'
import { useAccount } from '@renderer/context/account.context'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@renderer/context/loading.context'

const win: any = window
export function Finalization() {
  const { setAccount } = useAccount()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setIsLoading } = useLoading()
  const navigate = useNavigate()

  async function handleVerifyAccount() {
    setIsLoading(true)
    const IDD = await localStorage.getItem('accID')
    const verify = await win.api.verifyAccount(IDD)
    setIsLoading(false)
    if (verify.update == 'UPDATED') {
      setContentNotification({
        ...contentNotification,
        title: 'Conta Verificada',
        message: 'Sua conta foi verificada com sucesso!',
        type: 'info'
      })
      setShowNotification(true)
      setAccount(verify.data)
      navigate('/home')
    }
  }

  return (
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
  )
}
