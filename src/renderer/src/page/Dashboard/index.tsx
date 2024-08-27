import { useEffect, useState } from 'react'
import { FormTransf } from './_components/formTransf'
import { Button } from '@renderer/styles/global'
import { Loading } from '@renderer/components/loading'
import { Notification } from '@renderer/components/notification'

const win: any = window

export default function Dashboard() {
  const [showNotification, setShowNotification] = useState(false)
  const [balance, setBalance] = useState({})
  const [extract, setExtract] = useState<any>([])
  const [isLoad, setIsLoad] = useState(false)

  async function getBalance() {
    setIsLoad(true)
    setBalance({})
    await win.api.verifyBalance()
    await win.api.responseBalance((data) => {
      if (data == undefined || data == null) setShowNotification(true)
      setBalance(data)
    })

    await win.api.extractBalanceToday()
    await win.api.responseExtractToday((data) => {
      console.log('this data  ' + data)
      if (data == undefined || data == null) setShowNotification(true)

      setExtract(data.statement as any[])
    })
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

    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
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

      <Notification
        type="error"
        message="Erro ao tentar se comunicar com o servidor, por favor tente novamente"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  )
}
