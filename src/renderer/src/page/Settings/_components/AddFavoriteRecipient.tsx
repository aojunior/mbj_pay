import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, Table, Tbody, Td, Th, Thead, Title, Tr } from '../styles'
import NewFavorite from './_addNewFavorite';
import { useSecurity } from '@renderer/context/security.context';
import { Button } from '@renderer/styles/global';
import { useLoading } from '@renderer/context/loading.context';

const win: any = window
export function AddFavoriteRecipient() {
  const { security, callSecurityButton } = useSecurity()
  const { setIsLoading } = useLoading()
  const [favList, setFavList] = useState<any>([])
  const [idFav, setIdFav] = useState<string>('')

  function hiddenTaxId(taxId: string) {
    if(taxId.length == 14) {
      return taxId.slice(0, 5).padEnd(14, '**.***-**')
    } else {
      return taxId.slice(0, 5).padEnd(18, '*.***/****-**')
    }
  }

  async function updateFavList() {
    setIsLoading(true)
    const fav = await win.api.getFavoriteRecipients()
    setFavList(fav)
    setIsLoading(false)
  }
  
  async function handleDelete(id: string) {
    setIsLoading(true)
    await win.api.deleteFavoriteRecipients(id)
    updateFavList()
    setIsLoading(false)
  }

  useEffect(() => {
    if (security.confirmed && security.context === 'deleteFav') {
      handleDelete(idFav)
    }
    updateFavList()
    setIdFav('')
  }, [security.confirmed])

  useEffect(() => {
    updateFavList()
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
      <Title>Meus Favoritos</Title>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      
      <Table>
        <Thead>
          <Tr>
            <Th>Apelido</Th>
            <Th>Identificador</Th>
            <Th>Tipo</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {favList.map((data) => (
            <Tr key={data.id}>
              <Td>{data.nickname}</Td>
              <Td>{hiddenTaxId(data.taxId)}</Td>
              <Td>{data.type == '1' ? 'Chave PIX' : 'Conta TED'}</Td>
              <Td style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <EditIcon 
                  size={24}
                  onClick={() => {
                    callSecurityButton('editFav')
                    setIdFav(data.id)
                  }}
                />
                <DeleteIcon
                  size={24}
                  onClick={() => {
                    callSecurityButton('deleteFav')
                    setIdFav(data.id)
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <span style={{ color: '#999', textAlign: 'end' }}>{favList.length}</span>
      <Button style={{width: 150}} onClick={() => callSecurityButton('addFav')}>Adicionar Conta</Button>

      <span style={{ color: '#999', textAlign: 'end' }}>
        Ao Adicionar nova conta aos favoritos, ela ficará disponível na tela de Retiradas Pix.
      </span>
      {
      (security.confirmed && security.context === 'addFav') &&
        <NewFavorite id={''}/>
      }
      {
      (security.confirmed && security.context === 'editFav') &&
        <NewFavorite id={idFav}/>
      }
    </div>
  )
}
