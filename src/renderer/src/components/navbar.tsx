import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

const Container = styled.div`
  left: 0;
  transform: translateY(-80%);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateX(0);
    width: 100%;
  }
  width: 100%;

  background-color: #fff;
  backdrop-filter: blur(2px);
  background: #0001;
  padding: 5px 0 10px 0;
`

const Link = styled.button`
  border: none;
  padding: 5px;
  background-color: #3498db;
  border-radius: 4px;
  text-decoration: none;
  color: #fff;
  transition: transform 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: #1b75ab;
  }
`

export function Navbar() {
  const navigate = useNavigate()

  return (
    <Container>
      <ul style={{ display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'center' }}>
        <li>
          <Link onClick={() => navigate('/home', { replace: true })}>Início</Link>
        </li>
        <li>
          <Link onClick={() => navigate('/dashboard', { replace: true })}>Extrato / Transferências</Link>
        </li>
        <li>
          <Link onClick={() => navigate('/settings', { replace: true })}>Configurações</Link>
        </li>
      </ul>
    </Container>
  )
}
