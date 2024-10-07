import { useEffect, useState } from 'react'
import { FormTransf } from './_components/CashOut'
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
    if(data.message == 'SUCCESS' && extractToday.message == 'SUCCESS') {
      setBalance(data)
      setExtract(extractToday.statement as any[])
    }
    if(data.message == 'NETWORK_ERROR' || extractToday.message == 'NETWORK_ERROR') {
      setBalance({})
      setExtract([])
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Erro na comunicação com o servidor',
        message: 'Erro ao tentar se comunicar com o servidor, por favor tente novamente!'
      })
      setShowNotification(true)
    }
    if(data.message === 'GENERIC_ERROR' || extractToday.message === 'GENERIC_ERROR') {
      setBalance({})
      setExtract([])
      setContentNotification({
        title: 'Houve um Erro',
        message: 'Não foi possível carregar informações. Tente novamente mais tarde.',
        type: 'error'
      })
      setShowNotification(true)
    }
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