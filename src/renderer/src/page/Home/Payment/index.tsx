/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import { Container } from '@renderer/styles/global';
// import QRCode from '../../../assets/images.png'
import { Button, ContainInfo, ContainQRCode, Display, Footer, InfoDisplay, LoadInfo, QRcode, ValueAmount, ValueDisplay, ValueLabel } from './styles';
import { ContantRow, DotWave } from '../StandBy/styles';

function PaymentScreen ({file}) {
    const handleKeyButton = async (event) => {
        switch(event.key || event) {
            case 'Escape':
                console.log('CANCEL')
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
                localStorage.clear()
                console.log(localStorage.getItem('clip'))
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
                    <LoadInfo>
                        <h3>Aguardando Pagamento </h3>
                        <ContantRow>
                            <DotWave/>
                            <DotWave/>
                            <DotWave/>
                        </ContantRow>
                    </LoadInfo>
                    <h4><code>ESC</code> - Cancelar</h4>
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