/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { Container, FormInput, Label, Separator, TextArea } from '@renderer/styles/global';
// import QRCode from '../../../assets/images.png'
import { Button, ContainInfo, ContainQRCode, Display, Footer, InfoDisplay, LoadInfo, QRcode, ValueAmount, ValueDisplay, ValueLabel } from './styles';
import { ContantRow, DotWave } from '../StandBy/styles';


const win: any = window

function PaymentScreen ({file}) {
    const [transactionStatus, setTransactionStatus] = useState('')

    function checkTransactionStatus(status: string) {
        setTransactionStatus('')
        switch (status) {
            case 'CREATED':
                setTransactionStatus('Aguardando...')
            break;
            case 'APPROVED':
                setTransactionStatus('Aprovado')
            break;
            case 'CANCELING':
                setTransactionStatus('Cancelando')
            break;
            case 'CANCELED':
                setTransactionStatus('Cancelada')
            break;
            case 'AUTHORIZED':
                setTransactionStatus('Autorizado')
            break;
            case 'CAPTURED':
                setTransactionStatus('Capturado')
            break;
            case 'OVERFILLED':
                setTransactionStatus('Cheio')
            break;
            case 'FATAL_ERROR':
                setTransactionStatus('Erro Fatal')
            break;
            case 'REJECTED':
                setTransactionStatus('Rejeitada')
            break;
            case 'EXPIRED':
                setTransactionStatus('Expirado')
            break;
            case 'PARTIAL':
                setTransactionStatus('Parcial')
            break;
            case 'UNFINISHED':
                setTransactionStatus('Inacabado')
            break;
            case 'ERROR':
                setTransactionStatus('Erro')
            break;
            default:
                setTransactionStatus('')
            break;
        }
    }

    const handleKeyButton = async (event) => {
        switch(event.key || event) {
            case 'Escape':
                win.api.cancelPayment()
            break;
            case 'F1':
               (async () => {
                    try {
                      await navigator.clipboard.writeText(file.instantPayment.textContent);
                      alert('Texto copiado para a área de transferência!');
                    } catch (err) {
                      console.error('Falha ao copiar o texto: ', err);
                    }
                })() 
                console.log('Copy to clipboard')
            break;
            case 'F2':
                console.log('Print QRCODE')
            break;
            case 'F3':
                win.api.verifyInstantPayment()
                win.api.responseVerifyInstantPayment(data => {
                    checkTransactionStatus(data.transactionStatus)
                })
            break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyButton);
    
        return () => {
          window.removeEventListener('keydown', handleKeyButton);
        };
    }, []);

    const QRCode = 'data:image/png;base64,'+file.instantPayment.generateImage.imageContent

    return (
    <Container style={{alignItems: 'center', justifyContent: 'center'}}>

        <Display>
            <ValueDisplay>
                <ValueLabel>Valor a Pagar:</ValueLabel>
                <ValueAmount>R$ { file.totalAmount ? Number(file.totalAmount).toFixed(2) : (0).toFixed(2)}</ValueAmount>
            </ValueDisplay>

            <InfoDisplay>
                <ContainQRCode>
                    <QRcode src={QRCode} alt="" />
                    {/* <QRcode src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSojqE7ztWUYLgAOLfIp8OrWRqDI-43JplTC8XdCZ8L9g&s" alt="" > */}
                </ContainQRCode>

                <ContainInfo>
                    {
                        transactionStatus.toUpperCase() !== 'Aguardando' && transactionStatus.toUpperCase() !== '' ?
                            <h3>{transactionStatus.toUpperCase()}</h3>
                        :
                        <>
                            <h3>{transactionStatus.toUpperCase()}</h3>
                            <LoadInfo style={{marginBottom: 25}}>
                                <h3>Aguardando Pagamento </h3>
                                <ContantRow>
                                    <DotWave/>
                                    <DotWave/>
                                    <DotWave/>
                                </ContantRow>
                            </LoadInfo>
                        </>
                    }
                    <h4><code>ESC</code> - Cancelar</h4>

                    <FormInput style={{width: '100%', marginTop: 40}}>
                        <Label>Chave Aleatoria:</Label>
                        <TextArea readOnly value={file.instantPayment.textContent} />
                    </FormInput>
                </ContainInfo>
            </InfoDisplay>
        </Display>
 
        <Footer>
            <Button onClick={() => handleKeyButton('F1')} ><code>F1</code> - Copiar Chave PIX</Button>
            <Button onClick={() => handleKeyButton('F2')} ><code>F2</code> - Imprimir QR Code</Button>
            <Button onClick={() => handleKeyButton('F3')} ><code>F3</code> - Consultar Pagamento</Button>
        </Footer>
    </Container>
    );
};

export default PaymentScreen;