import { useEffect, useState } from 'react';
import { Notification } from '@renderer/components/notification'
import NewFavorite from './_addNewFavorite';
import { useSecurity } from '@renderer/context/security.context';
import { Loading } from '@renderer/components/loading';
import { ShowPassword } from '@renderer/components/password';
// import { useNotification } from '@renderer/context/notification.context'

export function AddFavoriteRecipient() {
  // const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { showSecurity, security, setSecurity, callSecurityButton } = useSecurity()
  const [isLoad, setIsLoad] = useState(false)

  async function handleNotification() {
    window.location.reload();
  }

  useEffect(() => {
    if(security.confirmed && security.context === 'addFavorite') {

    }
    if(security.confirmed && security.context === 'editFavorite') {

    }
    if (security.confirmed && security.context === 'deleteFavorite') {
   
    }
  }, [security.confirmed])


  return (
    <>
      {isLoad && <Loading />}

      { showSecurity && <ShowPassword/> }
      <h1>Adicionar Favoritos</h1>
      
      <button onClick={() => callSecurityButton('addFavorite')}>Add Bank</button>
      {
      (security.confirmed && security.context === 'addFavorite') &&
        <NewFavorite />
      }
    </>
  )
}
