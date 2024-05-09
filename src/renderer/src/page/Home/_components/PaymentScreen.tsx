import React from 'react';
import QRCODE from '../../../assets/images.png';
// import { Container } from './styles';

function PaymentScreen (file) {

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
        <button className="btn-action" ><code>F1</code> - Copiar Chave PIX</button>
        <button className="btn-action"><code>F2</code> - Imprimir QR Code</button>
        <button className="btn-action"><code>F3</code> - Consultar Pagamento</button>
    </div>
    </>
    );
};

export default PaymentScreen;