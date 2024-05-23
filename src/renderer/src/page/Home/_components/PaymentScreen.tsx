/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import QRCODE from '../../../assets/images.png';

// import { Container } from './styles';

let chavePix = 'chave aleatoria'

function PaymentScreen (file) {
    const handleEsc = async (event) => {
        if (event.key === 'Escape') {
            window.api.tokenGenerator()
            window.api.accessToken(data => sessionStorage.setItem('token', data))
       }
    };
    const handleF1 = (event) => {
        if (event.key === 'F1' || event === 'F1') {
            console.log('Copy to clipboard')
        }
    };
    const handleF2 = (event) => {
        if (event.key === 'F2' || event === 'F2') {
            console.log('Print QRCODE')
        }
    };
    const handleF3 = (event) => {
        if (event.key === 'F3' || event === 'F3') {
            localStorage.clear()
            console.log(localStorage.getItem('clip'))
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleEsc);
        window.addEventListener('keydown', handleF1);
        window.addEventListener('keydown', handleF2);
        window.addEventListener('keydown', handleF3);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
          window.removeEventListener('keydown', handleF1);
          window.removeEventListener('keydown', handleF2);
          window.removeEventListener('keydown', handleF3);
        };
    }, []);

    return (
    <>
        <div className="painel shadow">
            <div className="value-display">
                <h4 className="value-label">Valor a Pagar:</h4>
                <h4 id="value-mount">R$ 40.00</h4>
            </div>

            <div className="info-display">
                <div className="contain-qrcode">
                    <img className='qrcode' src={QRCODE} alt="" />
                    {/* <img className="qrcode" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSojqE7ztWUYLgAOLfIp8OrWRqDI-43JplTC8XdCZ8L9g&s" alt="" > */}
                </div>

                <div className="contain-info">
                    <div className="load-info">
                        <h3>Aguardando Pagamento </h3>
                        <div>
                            <div className="dot-wave"></div>
                            <div className="dot-wave"></div>
                            <div className="dot-wave"></div>
                        </div>
                    </div>
                    <h4><code>ESC</code> - Cancelar</h4>
                </div>
            </div>
        </div>

        <div className="content-bottom">
            <button className="btn-action" onClick={() => handleF1('F1')} ><code>F1</code> - Copiar Chave PIX</button>
            <button className="btn-action" onClick={() => handleF2('F2')} ><code>F2</code> - Imprimir QR Code</button>
            <button className="btn-action" onClick={() => handleF3('F3')} ><code>F3</code> - Consultar Pagamento</button>
        </div>
    </>
    );
};

export default PaymentScreen;