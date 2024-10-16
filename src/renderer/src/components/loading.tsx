import { useLoading } from '@renderer/context/loading.context'
import { styled, keyframes } from 'styled-components'

const Container = styled.dialog`
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(4px);
  background: #0000006f;
  padding: 5px;
  display: flex;
  position: absolute;
  top: 0;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Spinner = styled.div`
  border: 8px solid rgba(255, 255, 255);
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 0.7s linear infinite;
`

export function Loading() {
  const { isLoading } = useLoading()

  return isLoading && (
    <Container id="dialog">
      <Spinner />
    </Container>
  )
}
