import { Button } from '@renderer/styles/global'
import { DeleteIcon, Table, Tbody, Td, Th, Thead, Tr } from '../styles'
import { useEffect, useState } from 'react'
import { Loading } from '@renderer/components/loading'
import { Notification } from '@renderer/components/notification'
import { useAccount } from '@renderer/context/account.context'
import { ShowPassword } from '@renderer/components/password'
import { useNotification } from '@renderer/context/notification.context'
import { useSecurity } from '@renderer/context/security.context'
import { delay } from '@shared/utils'

const win: any = window

export function ManageAlias() {
  const { accState } = useAccount()
  const { showSecurity, security, setSecurity, callSecurityButton } = useSecurity()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [aliasData, setAliasData] = useState<any>([])
  const [isLoad, setIsLoad] = useState(false)
  const [selectedAlias, setSelectedAlias] = useState('')

  const handleCreateAlias = async () => {
    if (aliasData.length > 0) {
      setContentNotification({
        ...contentNotification,
        title: 'Limite de chave Pix atingida',
        message: "Não foi possível cadastrar uma nova chaves Pix!",
        type: 'warning'
      })
      setShowNotification(true)
      return
    }
    setIsLoad(true)
    let create = await win.api.createAlias()
    if (create.message === 'CREATED' ) {
      setContentNotification({
        ...contentNotification,
        title: 'Chave Pix registrada com sucesso!',
        message:
          'Sua chave Pix foi registrada com sucesso! Aguarde alguns minutos para consultá-la',
        type: 'confirm'
      })
      setAliasData(create.aliases)
    } else {
      setContentNotification({
        ...contentNotification,
        title: 'Erro ao registrar nova chave Pix!',
        message: 'Erro ao registrar nova chave Pix! Por favor tente novamente mais tarde.',
        type: 'error'
      })
    }
    setShowNotification(true)
    setSelectedAlias('')
    setSecurity({
      context: '',
      confirmed: false
    })
    setIsLoad(false)
  }

  const handleDeleteAlias = async () => {
    setIsLoad(true)
    const del = await win.api.deleteAlias(selectedAlias)
    if(del.message === 'SUCCESS') {
      setAliasData(del.data)
      setContentNotification({
        ...contentNotification,
        title: 'Chave Pix deletada',
        message: 'Sua chave Pix foi deletada com sucesso!',
        type: 'warning'
      })
    }
    if(del.message === 'NETWORK_ERROR') {
      setContentNotification({
        title: 'Erro na comunicação com o servidor',
        message: 'Não foi possível deletar a chave Pix. Tente novamente mais tarde.',
        type: 'error'
      })
    }
    if(del.message === 'GENERIC_ERROR') {
      setContentNotification({
        title: 'Houve um Erro',
        message: 'Não foi possível deletar a chave Pix. Tente novamente mais tarde.',
        type: 'error'
      })
    }
    setShowNotification(true)
    setSelectedAlias('')
    setSecurity({
      context: '',
      confirmed: false
    })
    setIsLoad(false)
  }

  const handleKeyButton = async (event) => {
    switch (event.key || event) {
      case 'F5':
        setIsLoad(true)
        if (accState?.status == 'REGULAR') {
          let resp = await win.api.updateAlias()
          console.log(resp)
          if(resp.message === 'NETWORK_ERROR') {
            setContentNotification({
              title: 'Erro na comunicação com o servidor',
              message: 'Não foi possível atualizar a lista de chaves Pix. Tente novamente mais tarde.',
              type: 'error'
            })
          }
          if(resp.message == 'GENERIC_ERROR') {
            setContentNotification({
              title: 'Houve um Erro',
              message: 'Não foi possível atualizar a lista de chaves Pix. Tente novamente mais tarde.',
              type: 'error'
            })
          }
          if(resp.message == 'SUCCESS') {
            await delay(3000)
            let resp = await win.api.getAlias()
            setAliasData(resp)
            setContentNotification({
              ...contentNotification,
              title: 'Atualizado com Sucesso',
              message: 'Sua lista de chaves Pix foi atualizada com sucesso!',
              type: 'info'
            })
          }
        }
        setShowNotification(true)
        setIsLoad(false)
        break
    }
  }

  useEffect(() => {
    (async () => {
      setIsLoad(true)
      let resp = await win.api.getAlias()
      setAliasData(resp)
      setIsLoad(false)
    })()
    setSecurity({
      context: '',
      confirmed: false
    })
    window.addEventListener('keydown', handleKeyButton)
    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
  }, [])

  useEffect(() => {
    if (security.confirmed && security.context === 'deleteAlias') {
      handleDeleteAlias()
    }
    if(security.confirmed && security.context === 'createAlias') {
      handleCreateAlias()
    }
  }, [security.confirmed])

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
      {showSecurity && <ShowPassword />}
      <Button
        style={{ position: 'absolute', right: 40, top: 150 }}
        onClick={() => handleKeyButton('F5')}
      >
        <code>F5</code> - Atualizar
      </Button>

      <h1> Chave Pix </h1>
      <>
        <Table>
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Chave</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {aliasData.map((data) => (
              <Tr>
                <Td>{data.status}</Td>
                <Td>{data.alias}</Td>
                <Td>
                  <DeleteIcon
                    size={24}
                    onClick={() => {
                      callSecurityButton('deleteAlias')
                      setSelectedAlias(data.alias)
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <span style={{ color: '#999', textAlign: 'end' }}>{aliasData.length}/1</span>
        {accState?.status == 'REGULAR' && <Button onClick={() => callSecurityButton('createAlias')}>Add Chave</Button>}
      </>
      <span style={{ color: '#999', textAlign: 'end' }}>
        Ao criar uma nova chave pix, deverá aguarda alguns minutos antes de ativá-la, para que o
        banco central possa registrar a nova chave corretamente.
      </span>
      <Notification />
    </div>
  )
}
