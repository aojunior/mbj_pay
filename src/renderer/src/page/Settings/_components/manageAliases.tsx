import { Button } from '@renderer/styles/global'
import { DeleteIcon, Table, Tbody, Td, Th, Thead, Tr } from '../styles'
import { useEffect, useState } from 'react'
import { Loading } from '@renderer/components/loading'
import { Notification } from '@renderer/components/notification'
import { useAccount } from '@renderer/context/account.context'
import { Aliases } from '@prisma/client'

type aliasProps = {
  aliases: Aliases[]
}

const win: any = window

export function ManageAlias({aliases}: aliasProps) {
  const { accState } = useAccount()
  const [aliasData, setAliasData] = useState(aliases)
  const [isLoad, setIsLoad] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    type: '' as 'error' | 'warning' | 'info' | 'confirm' | 'custom'
  })

  const handleCreateAccount = async () => {
    if(aliasData.length == 5) {
      setNotification({
        message: 'Você já possui 5 chaves Pix registradas!',
        type: 'warning'
      })
      setShowNotification(true)

      return
    }
    setIsLoad(true)
    let create = await win.api.createAlias()
    setTimeout(async () => {
      if(create === 'CREATED') {
        let resp = await win.api.verifyAlias()
        setAliasData(resp)
        setNotification({
          message: 'Sua chave Pix foi registrada com sucesso! Aguarde alguns minutos para consultá-la',
          type: 'confirm'
        })
        setShowNotification(true)
      } else {
        setNotification({
          message: 'Erro ao criar nova chave Pix! Por favor tente novamente mais tarde.',
          type: 'error'
        })
        setShowNotification(true)
      }
    setIsLoad(false)
    }, 5500)

    return create
  }

  const handleDeleteAlias = async (alias) => {
    setIsLoad(true)
    const del = await win.api.deleteAlias(alias)
    let resp = await win.api.verifyAlias()
    setAliasData(resp)
    setNotification({
      message: 'Sua chave Pix foi deletada com sucesso!',
      type: 'warning'
    })
    setShowNotification(true)
    setIsLoad(false)
    return del
  }

  const handleKeyButton = async (event) => {
    switch (event.key || event) {
      case 'F5':
        setIsLoad(true)
        if (accState.status == 'REGULAR') {
          await win.api.updateAlias()
          let resp = await win.api.verifyAlias()
          setAliasData(resp)
          setNotification({
            message: 'Chave Pix atualizada com sucesso!',
            type: 'info'
          })
          setShowNotification(true)
        }
        setIsLoad(false)  
      break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyButton)
    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
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

      <Button style={{ position: 'absolute', right: 40, top: 150 }} onClick={() => handleKeyButton('F5')} >
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
                  <DeleteIcon size={24} onClick={() => handleDeleteAlias(data.alias)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <span style={{ color: '#999', textAlign: 'end' }}>{aliasData.length}/5</span>
        {accState.status == 'REGULAR' && <Button onClick={handleCreateAccount}>Add Chave</Button>}
      </>
      <span style={{ color: '#999', textAlign: 'end' }}>
        Ao criar uma nova chave pix, deverá aguarda alguns minutos antes de ativá-la, para que o 
        banco central possa registrar a nova chave corretamente.
      </span>
      <Notification
        type={notification.type}
        show={showNotification}
        onClose={() => setShowNotification(!showNotification)}
        message={notification.message}
      />
    </div>
  )
}
