import { useState, useEffect} from 'react'
import PaymentScreen from '@renderer/page/Home/_components/Payment'
import StandBy from '@renderer/page/Home/_components/StandBy'
import { Notification } from '@renderer/components/notification'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window

function Home() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [file, setFile] = useState(null)

  useEffect( () => {
    win.api.reciveFile((data) => {
      if(data?.success === false) {
        setContentNotification({
          ...contentNotification,
          title: 'Error',
          message: data?.error,
          type: 'error'
        })
        setShowNotification(true)
        return
      }
      setFile(data);
      localStorage.clear()
      localStorage.setItem('transactionid', data.transactionId)
    });
  }, [file])

  return (
    <>
    {
      file === null ? <StandBy /> : <PaymentScreen file={file} />
    }
      <Notification/>
    </>
  )
}

export default Home