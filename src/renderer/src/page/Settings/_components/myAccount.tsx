import { Button, ContentInRow, Separator } from '@renderer/styles/global'
import { Input, Label, WrapIpunt } from '../styles'
import { formatCNPJandCPF, formatDate } from '@shared/utils'
import { useState } from 'react'
import { Notification } from '@renderer/components/notification'
import { Loading } from '@renderer/components/loading'
import { Client } from '@prisma/client'


type accountProps = Client
type Props = {
  acc: accountProps
}

const win: any = window

export function MyAccount({ acc }: Props) {
  const [account, setAccount] = useState(acc)
  const [isLoad, setIsLoad] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    type: '' as 'error' | 'warning' | 'info' | 'confirm' | 'custom'
  })

  async function getAccount() {
    const data = await win.api.getAccount()
    setAccount(data)
  }

  const handleVerifyAccount = async () => {
    setIsLoad(true)
    const verify = await win.api.verifyAccount()
    if (verify == 'UPDATED') {
      getAccount()
      setNotification({
        message: 'Sua conta foi atualizada!',
        type: 'info'
      })
    } else if (verify == 'RELOADED') {
      setNotification({
        message: 'Sua conta foi atualizada!',
        type: 'info'
      })
    } else {
      setNotification({
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
    if(del == 'DELETED') {
      setNotification({
        message: 'Sua conta foi deletada com sucesso!',
        type: 'warning'
      })
    } else {
      setNotification({
        message: 'Houve um erro ao tentar deletar a conta, tente novamente!',
        type: 'error'
      })
    }
    setShowNotification(true)
    setIsLoad(false)
  }

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

      <WrapIpunt>
        <Label>Razão Social</Label>
        <Input
          type="text"
          value={account.companyName}
          style={{ width: 140 }}
        />
      </WrapIpunt>

      <WrapIpunt>
        <Label>CNPJ</Label>
        <Input
          type="text"
          value={formatCNPJandCPF(account.taxId as string)}
          style={{ width: 140 }}
        />
      </WrapIpunt>

      <WrapIpunt>
        <Label>ID da Conta</Label>
        <Input type="text" value={account.accountId} />
      </WrapIpunt>

      <Label style={{color: '#444', marginTop: 15}}>Detalhes Bancário</Label>
      <ContentInRow style={{ width: '80%' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Label>Conta</Label>
          <Input type="text" value={account.branchBank} style={{ width: 120 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Label>Filial (Branch)</Label>
          <Input type="text" value={account.accountBank} style={{ width: 120 }} />
        </div>
      </ContentInRow>

      <ContentInRow style={{ width: '80%' }}>
        <WrapIpunt>
          <Label>Data de Criação</Label>
          <Input
            type="text"
            value={formatDate(account.createdAT)} 
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

        <Button style={{ backgroundColor: 'red' }} onClick={handleDeleteAccount}>
          Excluir Conta
        </Button>
      </ContentInRow>

      <Notification
        type={notification.type}
        show={showNotification}
        onClose={() => setShowNotification(!showNotification)}
        message={notification.message}
      />
    </div>
  )
}
