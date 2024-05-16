/* eslint-disable prettier/prettier */
import electronLogo from '../assets/logo.png'
import { styled } from 'styled-components'

const Container = styled.div`
    padding: 0;
`
const Logo = styled.img`
    -webkit-user-drag: none;
    height: 80px;
    width: 180px;
    will-change: filter;
    transition: filter 300ms;
    &:hover {
        filter: drop-shadow(0 0 1.2em #6988e6aa);
    }
`

export function Header() {
  return (
    <Container>
      <Logo alt="logo"  src={electronLogo} />
    </Container>
  )
}
