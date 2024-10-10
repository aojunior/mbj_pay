import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, Table, Tbody, Td, Th, Thead, Tr } from '../styles'
import NewFavorite from './_addNewFavorite';
import { useSecurity } from '@renderer/context/security.context';
import { Loading } from '@renderer/components/loading';
import { ShowPassword } from '@renderer/components/password';
import { Button } from '@renderer/styles/global';

const win: any = window
export function AddFavoriteRecipient() {
  const { showSecurity, security, callSecurityButton } = useSecurity()
  const [isLoad, setIsLoad] = useState(false)
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
    const fav = await win.api.getFavoriteRecipients()
    setFavList(fav)
  }
  
  async function handleDelete(id: string) {
    setIsLoad(true)
    await win.api.deleteFavoriteRecipients(id)
    updateFavList()
    setIsLoad(false)
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
    <>
      {isLoad && <Loading />}
      { showSecurity && <ShowPassword/> }
      <h1>Meus Favoritos</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      
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
    </>
  )
}
