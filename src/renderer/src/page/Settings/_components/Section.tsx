import { styled } from 'styled-components'

export function Section({ children }) {
  return <Container>
    {children}
    </Container>
}

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
`
