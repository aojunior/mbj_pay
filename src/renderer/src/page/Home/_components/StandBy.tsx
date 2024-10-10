import React, {useEffect} from 'react'
import { DotWave } from '../styles'
import { Button, Container, ContentInRow } from '@renderer/styles/global'
import { CreatePayment } from './CreatePayment'
import { useUtils } from '@renderer/context/utils.context'

const StandBy: React.FC = () => {
  const { openModal, toggleModal } = useUtils()

  const handleKeyButton = async (event) => {
    switch (event.key || event) {
      case 'F4':
        toggleModal('createPayment', true)
      break;
    }
  }
    
  // const win: any = window
  // await win.api.logger({type: 'info', message: 'test successfull'})

  useEffect(() => {
    window.addEventListener('keydown', handleKeyButton)
    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
  }, [])
  
  return (
    <Container style={{ alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <h2>Aguardando Arquivo</h2>
      <ContentInRow>
        <DotWave />
        <DotWave />
        <DotWave />
      </ContentInRow>

      <Button style={{width: 200, position: 'absolute', bottom: 120}} onClick={() => handleKeyButton('F4')}>
        <code>F4</code> - Novo Pagamento 
      </Button>
      {openModal.modalName == 'createPayment' && openModal.open  && <CreatePayment />}
    </Container>
  )
}

export default StandBy
