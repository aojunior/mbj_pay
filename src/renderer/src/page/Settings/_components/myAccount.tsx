import { Button, ContentInRow, Separator } from '@renderer/styles/global'
import { Input, Label, WrapIpunt } from '../styles'
import { formatCNPJandCPF, formatDate } from '@shared/utils'
import { useEffect, useState } from 'react'
import { Notification } from '@renderer/components/notification'
import { Loading } from '@renderer/components/loading'
import { Client } from '@prisma/client'
import { ShowPassword } from '@renderer/components/password'
import { useSecurity } from '@renderer/context/security.context'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window

export function MyAccount() {
  const { setShowSecurity, showSecurity, security, setSecurity } = useSecurity()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [account, setAccount] = useState<Client>({} as Client)
  const [isLoad, setIsLoad] = useState(false)

  const [pass, setPass] = useState('')

  async function getAccount() {
    setIsLoad(true)

    const data = await win.api.getAccount()
    setAccount(data)
    setIsLoad(false)
  }

  const handleVerifyAccount = async () => {
    setIsLoad(true)
    const verify = await win.api.verifyAccount()
    if (verify == 'UPDATED') {
      getAccount()
      setContentNotification({
        ...contentNotification,
        title: 'Sua conta foi atualizada!',
        type: 'info'
      })
    } else if (verify == 'RELOADED') {
      setContentNotification({
        ...contentNotification,
        title: 'Sua conta foi atualizada!',
        type: 'info'
      })
    } else {
      setContentNotification({
        ...contentNotification,
        title: 'Erro',
        message: 'Houve um erro ao tentar verificar a conta, tente novamente!',
        type: 'error'
      })
      setShowNotification(true)
    }
    setIsLoad(false)
  }

  const handleDeleteAccount = async () => {
    setIsLoad(true)
    const del = await win.api.deleteAccount()
    if (del == 'DELETED') {
      setContentNotification({
        ...contentNotification,
        title: 'Conta desativada',
        message: 'Sua conta foi inativada com sucesso!',
        type: 'info'
      })
    }
    if (del == 'alias_registered') {
      setContentNotification({
        ...contentNotification,
        title: 'Conta ainda possui alias registrado ',
        message: "É necessário excluir todos os alias antes de inativar a conta!",
        type: 'error'
      })
    }
    if(del == 'balance_error') {
      setContentNotification({
        ...contentNotification,
        title: 'Impossível desativar',
        message: 'Você ainda possui saldo em conta!',
        type: 'error'
      })
    } else {
      console.log(del)
      setContentNotification({
        ...contentNotification,
        title: 'Erro',
        message: 'Houve um erro ao tentar inativar a conta, tente novamente!',
        type: 'error'
      })
    }
    setIsLoad(false)
    setShowNotification(true)
  }

  const handleChangePassword = async () => {
    if (pass.length < 4) {
      setContentNotification({
        ...contentNotification,
        title: "Senha Inva'lida",
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
        type: 'confirm'
      })
      setShowNotification(true)
    }
    setPass('')
    setSecurity({
      context: '',
      confirmed: false
    })
  }

  useEffect(() => {
    getAccount()
    setSecurity({
      context: '',
      confirmed: false
    })
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 40,
        paddingRight: 40,
        gap: 15
      }}
    >
      {isLoad && <Loading />}
      <h1> Informações da Conta</h1>

      {showSecurity && <ShowPassword />}
      <ContentInRow>
        <WrapIpunt>
          <Label>Razão Social</Label>
          <Input type="text" value={account?.companyName} />
        </WrapIpunt>

        <WrapIpunt>
          {security.confirmed ? (
            <>
              <Input
                type="text"
                placeholder="Digite a Nova Senha"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <Button onClick={handleChangePassword}>Salvar</Button>
            </>
          ) : (
            <Button onClick={() => setShowSecurity(true)}>Alterar Senha</Button>
          )}
        </WrapIpunt>
      </ContentInRow>

      <WrapIpunt>
        <Label>CNPJ</Label>
        <Input
          type="text"
          value={formatCNPJandCPF(account?.taxId as string)}
          style={{ width: 140 }}
        />
      </WrapIpunt>

      <WrapIpunt>
        <Label>ID da Conta</Label>
        <Input type="text" value={account?.accountId} />
      </WrapIpunt>

      <Label style={{ color: '#444', marginTop: 15 }}>Detalhes Bancário</Label>
      <ContentInRow style={{ width: '50%' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Label>Conta</Label>
          <Input type="text" value={account?.accountBank} style={{ width: 120 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Label>Agência (Branch)</Label>
          <Input type="text" value={account?.branchBank} style={{ width: 120 }} />
        </div>
      </ContentInRow>

      <ContentInRow style={{ width: '80%' }}>
        <WrapIpunt>
          <Label>Data de Criação</Label>
          <Input
            type="text"
            value={formatDate(account?.createdAT)}
            style={{ width: 120, textAlign: 'center' }}
          />
        </WrapIpunt>

        <WrapIpunt>
          <Label>Status da Conta</Label>
          <Input type="text" value={account?.status} style={{ width: 120, textAlign: 'center' }} />
        </WrapIpunt>
      </ContentInRow>

      <Separator />

      <ContentInRow>
        <Button onClick={handleVerifyAccount}>Verificar</Button>

        <Button style={{ backgroundColor: account?.status !== 'CLOSED' ? 'red' : '#777',  }} onClick={handleDeleteAccount} disabled={account?.status === 'CLOSED'}>
          Inativar Conta
        </Button>
      </ContentInRow>

      <Notification />
    </div>
  )
}
