import { Notification } from '@renderer/components/notification'
import { useNavigate } from 'react-router-dom'
// import { useNotification } from '@renderer/context/notification.context'

const win : any = window
export function AddBank() {
  // const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  let nav = useNavigate()
 
  async function handleNotification() {
    window.location.reload();

  }

  return (
    <>
      <h1>yh</h1>
      <button onClick={handleNotification}>Add Bank</button>
    
      <Notification />
    </>
  )
}
