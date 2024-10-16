import { Button } from '@renderer/styles/global'
import { DeleteIcon, Table, TableWrapper, Tbody, Td, Th, Thead, Title, Tr } from '../styles'
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
  const { accData } = useAccount()
  const { showSecurity, security, setSecurity, callSecurityButton } = useSecurity()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [aliasData, setAliasData] = useState<any>([])
  const [isLoad, setIsLoad] = useState(false)
  const [selectedAlias, setSelectedAlias] = useState('')

  const handleCreateAlias = async () => {
    if (aliasData.length >= 20) {
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
      console.log(create)
      await delay(1000)
      let resp = create.aliases.data
      setAliasData(resp)
      setContentNotification({
        ...contentNotification,
        title: 'Chave Pix registrada com sucesso!',
        message: 'Sua chave Pix foi registrada com sucesso! Aguarde alguns minutos para consultá-la',
        type: 'success'
      })
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
    if(del.message === 'deleted alias') {
      setAliasData(del.data)
      setContentNotification({
        ...contentNotification,
        title: 'Chave Pix deletada',
        message: 'Sua chave Pix foi deletada com sucesso!',
        type: 'warning'
      })
    } else {
      setContentNotification({
        title: 'Houve um erro ao deletar',
        message: del.message,
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
        if (accData?.status == 'REGULAR') {
          let resp = await win.api.updateAlias()
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
          } else {
            setContentNotification({
              title: 'Houve um Erro',
              message: resp.message,
              type: 'error'
            })
          }
        }
        setShowNotification(true)
        setIsLoad(false)
        break
    }
  }

  function hiddenAlias(alias: string) {
    return alias.slice(0, 19 ).padEnd(36, '**********')
  }

  useEffect(() => {
    (async () => {
      setIsLoad(true)
      let resp = await win.api.updateAlias()
      setAliasData(resp.data)
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
        style={{ position: 'absolute', right: 40, top: 130 }}
        onClick={() => handleKeyButton('F5')}
      >
        <code>F5</code> - Atualizar
      </Button>

      <Title> Chave Pix </Title>
      <>
        <TableWrapper>
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
                <Tr key={data.alias}>
                  <Td>{data.status}</Td>
                  <Td>{hiddenAlias(data.alias)}</Td>
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
        </TableWrapper>
        <span style={{ color: '#999', textAlign: 'end' }}>{aliasData.length}/20</span>
        {(accData?.status == 'REGULAR' && aliasData.length < 20) &&
        <Button onClick={() => callSecurityButton('createAlias')} style={{width: 140}}>Criar Chave Pix</Button>
        }
      </>
      <span style={{ color: '#999', textAlign: 'end' }}>
        Ao criar uma nova chave pix, deverá aguarda alguns minutos antes de usá-la, para que o
        banco central possa registrar a nova chave corretamente.
      </span>
      <Notification />
    </div>
  )
}
