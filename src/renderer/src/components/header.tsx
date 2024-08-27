/* eslint-disable prettier/prettier */
import electronLogo from '../assets/logo.png'
import { styled } from 'styled-components'

const Container = styled.div`
  margin:0;
  padding: 0;
  z-index: 0;
`
const Logo = styled.img`
  -webkit-user-drag: none;
  height: 60px;
  width: 180px;
  will-change: filter;
  transition: filter 300ms;
  filter: drop-shadow(0 0 1.4em #000);
  &:hover {
    filter: drop-shadow(0 0 1.2em #6988e69);
  }
`

export function Header() {
  return (
    <Container>
      <Logo alt="logo" src={electronLogo} />
    </Container>
  )
}
