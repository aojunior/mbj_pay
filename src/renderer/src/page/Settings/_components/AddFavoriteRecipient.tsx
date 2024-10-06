import { useEffect, useState } from 'react';
import { Notification } from '@renderer/components/notification'
import { DeleteIcon, EditIcon, Table, Tbody, Td, Th, Thead, Tr } from '../styles'
import NewFavorite from './_addNewFavorite';
import { useSecurity } from '@renderer/context/security.context';
import { Loading } from '@renderer/components/loading';
import { ShowPassword } from '@renderer/components/password';
// import { useNotification } from '@renderer/context/notification.context'

export function AddFavoriteRecipient() {
  // const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { showSecurity, security, setSecurity, callSecurityButton } = useSecurity()
  const [isLoad, setIsLoad] = useState(false)
  const data = [
    {
      id: '1',
      nickname: 'Meu ITAU',
      type: '2',
      taxId: '00.000.000/0000-00'
    },
    {
      id: '2',
      nickname: 'Conta Inter',
      type: '1',
      taxId: '000.000.000-00'
    }
  ]

  function hiddenTaxId(taxId: string) {
    if(taxId.length == 14) {
      return taxId.slice(0, 5).padEnd(14, '**.***-**')
    } else {
      return taxId.slice(0, 5).padEnd(18, '*.***/****-**')
    }
  }

  function handleEdit(id: string) {
    
  }
  function handleDelete(id: string) {

  }
  
  useEffect(() => {
    if(security.confirmed && security.context === 'addFavorite') {

    }
    if(security.confirmed && security.context === 'editFav') {
      handleEdit('')
    }
    if (security.confirmed && security.context === 'deleteFav') {
      handleDelete('')
    }
  }, [security.confirmed])


  return (
    <>
      {isLoad && <Loading />}

      { showSecurity && <ShowPassword/> }
      <h1>Favoritos</h1>
      
      <Table>
          <Thead>
            <Tr>
              <Th>Apelido</Th>
              <Th>Chave</Th>
              <Th>Tipo</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((data) => (
              <Tr>
                <Td>{data.nickname}</Td>
                <Td>{hiddenTaxId(data.taxId)}</Td>
                <Td>{data.type == '1' ? 'Chave PIX' : 'Conta TED'}</Td>
                <Td style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <EditIcon 
                    size={24}
                    onClick={() => {
                      callSecurityButton('editFav')
                    }}
                  />
                  <DeleteIcon
                    size={24}
                    onClick={() => {
                      callSecurityButton('deleteFav')
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>


      <button onClick={() => callSecurityButton('addFavorite')}>Add Bank</button>
      {
      (security.confirmed && security.context === 'addFavorite') &&
        <NewFavorite />
      }
    </>
  )
}
