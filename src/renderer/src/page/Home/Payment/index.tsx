/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import { Container } from '@renderer/styles/global';
import { Button, ContainInfo, ContainQRCode, Display, Footer, InfoDisplay, LoadInfo, QRcode, ValueAmount, ValueDisplay, ValueLabel } from './styles';
import { ContantRow, DotWave } from '../StandBy/styles';

function PaymentScreen (file) {
    const handleKeyButton = async (event) => {
        switch(event.key || event) {
            case 'Escape':
                console.log('CANCEL')
            break;
            case 'F1':
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

    return (
    <Container style={{alignItems: 'center', justifyContent: 'center'}}>
        <Display>
            <ValueDisplay>
                <ValueLabel>Valor a Pagar:</ValueLabel>
                <ValueAmount>R$ { file.totalAmount ? Number(file.totalAmount).toFixed(2) : (0).toFixed(2)}</ValueAmount>
            </ValueDisplay>

            <InfoDisplay>
                <ContainQRCode>
                    <QRcode src='../../../assets/images.png' alt="" />
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