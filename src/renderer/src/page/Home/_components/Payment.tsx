/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { Container, ContentInRow, FormInput, Label, TextArea } from '@renderer/styles/global'
import {
  Button,
  ContainInfo,
  ContainQRCode,
  Display,
  Footer,
  InfoDisplay,
  LoadInfo,
  QRcode,
  ValueAmount,
  ValueDisplay,
  ValueLabel,
  DotWave
} from '../styles'
import { useNotification } from '@renderer/context/notification.context'
import {FaCheckCircle} from 'react-icons/fa'
import { RiErrorWarningFill } from 'react-icons/ri'
import { GiCancel } from 'react-icons/gi'

const win: any = window

function PaymentScreen({ file }) {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [transactionStatus, setTransactionStatus] = useState('')
  const [isLoad, setIsLoad] = useState(false)

  function checkTransactionStatus(status: string) {
    switch (status) {
      case 'CREATED':
        setTransactionStatus('Aguardando')
        break
      case 'APPROVED':
        setTransactionStatus('Aprovado')
        break
      case 'CANCELING':
        setTransactionStatus('Cancelando')
        break
      case 'CANCELED':
        setTransactionStatus('Cancelada')
        break
      case 'AUTHORIZED':
        setTransactionStatus('Autorizado')
        break
      case 'CAPTURED':
        setTransactionStatus('Capturado')
        break
      case 'OVERFILLED':
        setTransactionStatus('Cheio')
        break
      case 'FATAL_ERROR':
        setTransactionStatus('Erro Fatal')
        break
      case 'REJECTED':
        setTransactionStatus('Rejeitada')
        break
      case 'EXPIRED':
        setTransactionStatus('Expirado')
        break
      case 'PARTIAL':
        setTransactionStatus('Parcial')
        break
      case 'UNFINISHED':
        setTransactionStatus('Inacabado')
        break
      case 'ERROR':
        setTransactionStatus('Erro')
        break
      default:
        setTransactionStatus('')
        break
    }
  }

  function renderIcon() {
    switch (transactionStatus) {
      case 'Aprovado':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
              <FaCheckCircle size={24} color="#4caf50" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Autorizado':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
              <FaCheckCircle size={24} color="#4caf50" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Capturado':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
              <FaCheckCircle size={24} color="#4caf50" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Cancelando':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
            <GiCancel size={24} color="#f44336" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Cancelada':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
            <GiCancel size={24} color="#f44336" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Cheio':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
            <RiErrorWarningFill size={24} color="#f4c836" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Erro Fatal':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
            <RiErrorWarningFill size={24} color="#f4c836" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Expirado':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
            <RiErrorWarningFill size={24} color="#f4c836" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
      case 'Erro':
        return (
          <div style={{marginBottom: 25, marginTop: 10}}>
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15, marginBottom: 25, marginTop: 10}}>
            <RiErrorWarningFill size={24} color="#f4c836" />
              <h3>{ transactionStatus.toUpperCase()}</h3>
            </ContentInRow>
              
            <h4>
              <code>Enter</code> - Finalizar
            </h4>
          </div>
        )
    }
  }

  const handleKeyButton = async (event) => {
    switch (event.key || event) {
      case 'Enter':
        if(transactionStatus == '' || transactionStatus == 'Aguardando') return
        await win.api.finishInstantPayment(file)
        break
      case 'Escape':
        if(transactionStatus !== '' && transactionStatus !== 'Aguardando') return
        const cancel = await win.api.cancelInstantPayment(file)
        if(cancel.status == 'CANCELED') {
          setTransactionStatus('Cancelada')
        }
        break
      case 'F1':
        (async () => {
          try {
            if(transactionStatus !== '' && transactionStatus !== 'Aguardando') return
            await navigator.clipboard.writeText(file.instantPayment.textContent)
            setContentNotification({
              ...contentNotification,
              title: 'Texto Copiado',
              message: 'Texto do QR Code foi copiado para a área de transferência.',
              type: 'info'
            })
            setShowNotification(true)
          } catch (err) {
            console.error('Falha ao copiar o texto: ', err)
          }
        })()
        break
      case 'F2':
        if(transactionStatus !== '' && transactionStatus !== 'Aguardando') return

        console.log('Print QRCODE')
        break
      case 'F3':
        setTransactionStatus('')
        setIsLoad(true)
        const resp = await win.api.verifyInstantPayment()
        checkTransactionStatus(resp.transactionStatus)
        setIsLoad(false)
        break
    }
  }

  const decoding =  async () => {
    setIsLoad(true)
    let d = {
      qrCode: file.instantPayment.textContent,
      datePayment: file.transactionDate.split('T')[0]
    }
    const qr = await win.api.decodingQrCode(d)
    console.log(qr)
    setIsLoad(false)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyButton)
    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
  }, [])
  
  const QRCode = 'data:image/png;base64,' + file.instantPayment.generateImage.imageContent

  return (
    <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Display>
        <ValueDisplay>
          <ValueLabel>Valor a Pagar:</ValueLabel>
          <ValueAmount>
            R$ {file.totalAmount ? Number(file.totalAmount).toFixed(2) : (0).toFixed(2)}
          </ValueAmount>
        </ValueDisplay>

        <InfoDisplay>
          <ContainQRCode>
            <QRcode src={QRCode} alt="" />
            <span>Aponte a câmera aqui</span>
          </ContainQRCode>

          <ContainInfo>
            {
              isLoad &&
              <LoadInfo style={{ marginBottom: 25, marginTop: 20}}>
                <ContentInRow style={{gap: 5}}>
                  <DotWave />
                  <DotWave />
                  <DotWave />
                </ContentInRow>
              </LoadInfo>
            }
            
            {transactionStatus !== '' && transactionStatus !== 'Aguardando' ? (
              renderIcon()
            ) : !isLoad && (
              <>
                <LoadInfo style={{ marginBottom: 25, marginTop: 10 }}>
                  <h3>Aguardando Pagamento </h3>
                  <ContentInRow>
                    <DotWave />
                    <DotWave />
                    <DotWave />
                  </ContentInRow>
                </LoadInfo>
                <h4>
                  <code>ESC</code> - Cancelar
                </h4>
              </>
            )}

            <FormInput style={{ width: '100%', marginTop: 40 }}>
              <Label>PIX Copiar e Colar:</Label>
              <TextArea readOnly value={file.instantPayment.textContent} />
            </FormInput>
          </ContainInfo>
        </InfoDisplay>
      </Display>

      <Footer>
        <Button onClick={() => handleKeyButton('F1')}>
          <code>F1</code> - Copiar Chave PIX
        </Button>
        <Button onClick={() => handleKeyButton('F2')}>
          <code>F2</code> - Imprimir QR Code
        </Button>
        <Button onClick={() => handleKeyButton('F3')}>
          <code>F3</code> - Consultar Pagamento
        </Button>
      </Footer>
     <Footer style={{marginTop: 10}}>
      <Button onClick={decoding}>
        Decodificar QR Code
      </Button>
     </Footer>
    </Container>
  )
}

export default PaymentScreen
