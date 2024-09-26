import React from 'react'
import { DotWave } from './styles'
import { Container, ContentInRow } from '@renderer/styles/global'

const StandBy: React.FC = () => {
  return (
    <Container style={{ alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <h2>Aguardando Arquivo</h2>
      <ContentInRow>
        <DotWave />
        <DotWave />
        <DotWave />
      </ContentInRow>
    </Container>
  )
}

export default StandBy
