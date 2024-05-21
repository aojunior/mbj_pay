import React from 'react';

const StandBy: React.FC = () => {
      
  return (
    <>
      <div className='contain-standby'>
          <h2>Aguardando Leitura de Arquivo</h2>
          <div>
              <div className="dot-wave"></div>
              <div className="dot-wave"></div>
              <div className="dot-wave"></div>
          </div>
      </div>
    </>
  )
}

export default StandBy;