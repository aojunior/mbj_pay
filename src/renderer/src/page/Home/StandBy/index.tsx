import React from 'react'
import { ContantRow, DotWave } from './styles'
import { Container } from '@renderer/styles/global'

const StandBy: React.FC = () => {
  return (
    <Container style={{ alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <h2>Aguardando Arquivo</h2>
      <ContantRow>
        <DotWave />
        <DotWave />
        <DotWave />
      </ContantRow>
    </Container>
  )
}

export default StandBy
