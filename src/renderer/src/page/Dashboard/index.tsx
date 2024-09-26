import { useEffect, useState } from 'react'
import { FormTransf } from './_components/formTransf'
import { Button } from '@renderer/styles/global'
import { Loading } from '@renderer/components/loading'
import { Notification } from '@renderer/components/notification'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window

export default function Dashboard() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [balance, setBalance] = useState({})
  const [extract, setExtract] = useState<any>([])
  const [isLoad, setIsLoad] = useState(false)

  async function getBalance() {
    setIsLoad(true)
    const data = await win.api.verifyBalance()
    const extractToday = await win.api.extractBalanceToday()
    if (data == undefined || data == null || extractToday == undefined || extractToday == null) {
      setIsLoad(false)
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Error Connecting to server',
        message: 'Erro ao tentar se comunicar com o servidor, por favor tente novamente!'
      })
      setShowNotification(true)
      return
    }
    setBalance(data)
    setExtract(extractToday as any[])
    setIsLoad(false)
  }
  const handleKeyButton = async (event) => {
    switch (event.key || event) {
      case 'F5':
        getBalance()
        break
    }
  }

  useEffect(() => {
    getBalance()
    window.addEventListener('keydown', handleKeyButton)
    return () => window.removeEventListener('keydown', handleKeyButton)
  }, [])

  return (
    <>
      <Button
        style={{ position: 'absolute', right: 10, top: 80 }}
        onClick={() => handleKeyButton('F5')}
      >
        <code>F5</code> - Atualizar
      </Button>
      <FormTransf balance={balance} extract={extract} />
      {isLoad && <Loading />}

      <Notification />
    </>
  )
}
