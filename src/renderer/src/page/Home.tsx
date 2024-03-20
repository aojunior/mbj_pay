import React from 'react';
import PaymentScreen from '@renderer/components/PaymentScreen';
import StandBy from '@renderer/components/StandBy';
const Home: React.FC = () => {
  async function render () {
    const a = window.electronAPI.render()
  }
  return(
    <>
      <StandBy/>
      <button onClick={render}> Teste </button>
    </>
  )
}

export default Home;