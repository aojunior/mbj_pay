import { styled, keyframes } from 'styled-components'

export const ContantRow = styled.div`
  display: flex;
  flex: row;
  gap: 5px;
`

const dotWaveAnimation = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
`

export const DotWave = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #3498db;
  border-radius: 50%;
  animation: ${dotWaveAnimation} 1.5s ease-in-out infinite;
  &:nth-child(2) {
    animation-delay: 1s;
  }
  &:nth-child(3) {
    animation-delay: 0.5s;
  }
`
