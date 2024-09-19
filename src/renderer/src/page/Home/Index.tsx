import { useState, useEffect} from 'react'
import PaymentScreen from '@renderer/page/Home/Payment'
import StandBy from '@renderer/page/Home/StandBy'

const win: any = window

function Home() {
  const [file, setFile] = useState(null)

  useEffect( () => {
    (async () => {
      const data = await win.api.reciveFile()
      console.log(data)
      setFile(data)
      localStorage.clear()
      localStorage.setItem('transactionid', data.transactionId)
      setFile(data)
    })()
  }, [])

  return file === null ? <StandBy /> : <PaymentScreen file={file} />
  // {/* <button onClick={sendMessage}> Send </button>
  // <button onClick={render}> Teste </button> */}
}

export default Home
