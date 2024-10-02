import { Notification } from '@renderer/components/notification'

// import { useNotification } from '@renderer/context/notification.context'

export function AddBank() {
  // const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  
 
  async function handleNotification() {
    window.location.reload();

  }

  return (
    <>
      <button onClick={handleNotification}>Add Bank</button>
    
      <Notification />
    </>
  )
}
