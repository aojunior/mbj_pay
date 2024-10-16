import { useEffect, useState } from 'react'
import { FormTransf } from './_components/CashOut'
import { Button } from '@renderer/styles/global'
import { useNotification } from '@renderer/context/notification.context'
import { useLoading } from '@renderer/context/loading.context'
import { handleMessageError } from '@shared/handleErrors'

const win: any = window

export default function Dashboard() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setIsLoading } = useLoading()
  const [balance, setBalance] = useState({})
  const [extract, setExtract] = useState<any>([])

  async function getBalance() {
    setIsLoading(true)
    const balance = await win.api.verifyBalance()
    const extractToday = await win.api.extractBalanceToday()
    if(balance.data && extractToday.data) {
      setBalance(balance.data)
      setExtract(extractToday.data.statement as any[])
    } else {
      let msg
      !balance.data ?
      msg = handleMessageError(balance) : msg = handleMessageError(extractToday)
      setBalance({})
      setExtract([])
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Houve um Erro',
        message: msg.message
      })
    }
    setShowNotification(true)
    setIsLoading(false)
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
    </>
  )
}