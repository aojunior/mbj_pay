import { Button, Container, ContentInRow, IconEye, IconEyeInvisible, Separator } from '@renderer/styles/global'
import { Input, Label, Title, WrapIpunt } from '../styles'
import { formatCNPJandCPF, formatPhoneInput } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useSecurity } from '@renderer/context/security.context'
import { useNotification } from '@renderer/context/notification.context'
import { useAccount } from '@renderer/context/account.context'
import { useLoading } from '@renderer/context/loading.context'

const win: any = window
export function MyAccount() {
  const { setShowSecurity, security, setSecurity } = useSecurity()
  const { accData, setAccount, getAccount } = useAccount()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setIsLoading } = useLoading()
  const [showTextPassword, setShowTextPassword] = useState(false)
  const [pass, setPass] = useState('')

  const handleVerifyAccount = async () => {
    setIsLoading(true)
    const verify = await win.api.verifyAccount()
    if (verify.message == 'UPDATED') {
      setAccount(verify.data)

      setContentNotification({
        ...contentNotification,
        title: 'Sua conta foi atualizada!',
        type: 'info'
      })
      setShowNotification(true)
      getAccount()
    } else {
      setContentNotification({
        title: 'Houve um Erro',
        message: verify.message,
        type: 'error'
      })
    }
    setIsLoading(false)
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    const del = await win.api.deleteAccount()
    if(del.message === 'success') {
      setContentNotification({
        ...contentNotification,
        title: 'Conta desativada',
        message: 'Sua conta foi inativada com sucesso!',
        type: 'info'
      })
    } else {
      if (del.messgage == 'alias_registered') {
        setContentNotification({
          ...contentNotification,
          title: 'Conta ainda possui alias registrado ',
          message: "É necessário excluir todos os alias antes de inativar a conta!",
          type: 'error'
        })
      } else {
        setContentNotification({
          title: 'Houve um Erro',
          message: del.message,
          type: 'error'
        })
      }
    }
    setIsLoading(false)
    setShowNotification(true)
  }

  const handleChangePassword = async () => {
    if (pass.length < 4) {
      setContentNotification({
        ...contentNotification,
        title: "Senha Inválida",
        message: 'Por favor, preencha o campo de senha com no mínimo 4 caracteres',
        type: 'error'
      })
      setShowNotification(true)
      return
    }
    const alter = await win.api.alterPassword(pass)
    if (alter == 'CHANGED') {
      setContentNotification({
        ...contentNotification,
        title: 'Nova Senha',
        message: 'Senha alterada com sucesso!',
        type: 'success'
      })
      setShowNotification(true)
    }
    setPass('')
    setSecurity({
      context: '',
      confirmed: false
    })
  }

  function togglePassword() {
    setShowTextPassword(!showTextPassword)
  }

  useEffect(() => {
    if (!accData) {
      getAccount()
    }
    setSecurity({
      context: '',
      confirmed: false
    })
  }, [])



  return (
    <Container style={{overflowY: 'auto'}}>
      <Title> Informações da Conta</Title>
      <ContentInRow>
        <WrapIpunt>
          <Label>Razão Social</Label>
          <Input readOnly type="text" value={accData?.companyName} />
        </WrapIpunt>

        <WrapIpunt>
          {security.confirmed ? (
            <>
              <ContentInRow style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Input
                  style={{ width: '100%',  boxSizing: 'border-box' }}
                  type={showTextPassword ? 'text' : 'password'}
                  placeholder="Digite a Nova Senha"
                  onChange={(e) => setPass(e.target.value)}
                  autoFocus
                />
                {showTextPassword ? (
                  <IconEyeInvisible
                    size={24}
                    style={{position: 'relative', right: 30}}
                    onClick={togglePassword}
                  />
                ) : (
                  <IconEye
                    size={24}
                    style={{position: 'relative', right: 30}}
                    onClick={togglePassword}
                  />
                )}
              </ContentInRow>
              <Button style={{ marginTop: 5, alignSelf: 'center'}} onClick={handleChangePassword}>Salvar</Button>
            </>
          ) : (
            <Button onClick={() => setShowSecurity(true)}>Alterar Senha</Button>
          )}
        </WrapIpunt>
      </ContentInRow>

      <WrapIpunt>
        <Label>CNPJ</Label>
        <Input
          readOnly
          type="text"
          value={formatCNPJandCPF(accData?.taxId as string)}
          style={{ width: 140 }}
        />
      </WrapIpunt>

      <WrapIpunt>
        <Label>ID da Conta</Label>
        <Input readOnly type="text" value={accData?.accountId} />
      </WrapIpunt>

      <ContentInRow style={{ width: '70%' }}>
        <WrapIpunt>
          <Label>Email</Label>
          <Input readOnly type="text" value={accData?.email} />
        </WrapIpunt>
        <WrapIpunt>
          <Label>Contato Tel.</Label>
          <Input readOnly type="text" value={formatPhoneInput(accData?.phoneNumber)} style={{width: 180}} />
        </WrapIpunt>
      </ContentInRow>


      <Label style={{ color: '#444', marginTop: 15 }}>Detalhes Bancário</Label>
      <ContentInRow style={{ width: '50%' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Label>Conta</Label>
          <Input readOnly type="text" value={String(accData?.accountBank)} style={{ width: 120 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Label>Agência (Branch)</Label>
          <Input readOnly type="text" value={String(accData?.branchBank)} style={{ width: 120 }} />
        </div>
      </ContentInRow>

      <ContentInRow style={{ width: '80%' }}>
        <WrapIpunt>
          <Label>Status da Conta</Label>
          <Input readOnly type="text" value={accData?.status} style={{ width: 120, textAlign: 'center' }} />
        </WrapIpunt>
      </ContentInRow>

      <Separator />

      <ContentInRow>
        <Button onClick={handleVerifyAccount}>Verificar</Button>
        <Button
        style={{ backgroundColor: accData?.status !== 'CLOSED' ? 'red' : '#777',  }} 
        onClick={handleDeleteAccount}
        disabled={accData?.status === 'CLOSED'}>
          Inativar Conta
        </Button>
      </ContentInRow>
    </Container>
  )
}
