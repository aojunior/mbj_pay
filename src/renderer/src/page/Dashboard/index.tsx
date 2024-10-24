import { useEffect, useState } from 'react'
import { CashOut } from './_components/CashOut'
import { Button, Container, ContentInRow } from '@renderer/styles/global'
import { useNotification } from '@renderer/context/notification.context'
import { useLoading } from '@renderer/context/loading.context'
import { handleMessageError } from '@shared/handleErrors'
import { MovimentsToday } from './_components/Moviments'

const win: any = window
export default function Dashboard() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { setIsLoading } = useLoading()
  const [balance, setBalance] = useState({})
  const [extract, setExtract] = useState<any>([])

  async function getBalance() {
    setIsLoading(true)
    try{
      const [verifyBalanceResult, extractBalanceResult] = await Promise.all([
        win.api.verifyBalance(),
        win.api.extractBalanceToday()
      ])
      if (verifyBalanceResult.message === 'success' && extractBalanceResult.message === 'success') {
        const verifyBalanceData = verifyBalanceResult.data;
        const extractBalanceData = extractBalanceResult.data;
        setBalance(verifyBalanceData)
        setExtract(extractBalanceData.statement as any[])
      } else {
        let msg
        !verifyBalanceResult.data ?
        msg = handleMessageError(verifyBalanceResult) : msg = handleMessageError(extractBalanceResult)
        setBalance({})
        setExtract([])
        setContentNotification({
          ...contentNotification,
          type: 'error',
          title: 'Houve um Erro',
          message: msg.message
        })
        setShowNotification(true)
      }    
    } catch (error) {
      await win.api.logger('error', error);
    } finally {
      setIsLoading(false)
    }      
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
      <Container >
        <ContentInRow>
          <CashOut balance={balance} getBalance={getBalance} />
          <MovimentsToday extract={extract} />
        </ContentInRow>
      </Container>

    </>
  )
}