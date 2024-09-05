import { styled } from 'styled-components'
import { IoIosWarning } from 'react-icons/io'
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import { Input } from '@renderer/styles/global'
import { useState } from 'react'
import { ContantRow } from '@renderer/page/Home/StandBy/styles'
import { useSecurity } from '@renderer/context/security.context'

const Container = styled.dialog`
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(2px);
  position: absolute;
  top: 0;
  background: #00000050;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`
const Section = styled.div`
  width: 50%;
  height: 250px;
  background-color: #fff;
  border: 1px solid #e7e7e4;
  border-radius: 8px;
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: center;
`
const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
const Title = styled.h2`
  font-weight: 600;
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
  gap: 15px
`
const Button = styled.button`
  border: 1px solid #e4e4e7;
  font-weight: 600;
  background-color: #3178c6;
  padding: 5px;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  &:hover {
    cursor: pointer;
  }
`
const win: any = window

export function ShowPassword() {
  const { textPassword, setTextPassword, security, setSecurity, setShowSecurity } = useSecurity()
  const [showTextPassword, setShowTextPassword] = useState(false)
  const [error, setError] = useState({
    message: '',
    borderColor: '#c4c4c7'
  })

  async function checkPassword() {
    const securityData = await win.api.security(textPassword)
    console.log(securityData)
    setSecurity({...security, confirmed: securityData})
    if(securityData) {
      setShowSecurity(false)
    } else {
      setError({
        message: 'Senha Invalida!',
        borderColor: 'red'
      })
    }
  }
  
  function togglePassword() {
    setShowTextPassword(!showTextPassword)
  }

  function handleChange(e) {
    setTextPassword(e.target.value); 
    setError({
      message: '',
      borderColor: '#c4c4c7'
    })
  }

  return (
    <Container>
      <Section>
        <span style={{ cursor: 'pointer', alignSelf: 'flex-end', fontWeight: '700', color: '#777' }} onClick={() => setShowSecurity(false)}>X</span>
        <Header>
          <Title>Confirmação de senha</Title>
          <IoIosWarning size={28} color="#FFA500" />
        </Header>
        <p>Para contiuar, digite sua senha:</p>
        <ContantRow style={{justifyContent: 'flex-end', alignItems: 'center'}}>
          <Input style={{width: '75%', borderColor: error.borderColor}} type={showTextPassword ? "text":"password"} placeholder="Confirme a senha" onChange={handleChange} />
          {
          showTextPassword ?
          <AiFillEyeInvisible size={24} color='#4f4f4f' onClick={togglePassword} style={{cursor: 'pointer'}} />
          :
          <AiFillEye size={24} color='#4f4f4f' onClick={togglePassword} style={{cursor: 'pointer'}} />
          }
        </ContantRow>

        <Footer>
          <p style={{color: 'red'}}>{error.message}</p>
          <Button onClick={checkPassword}>
            Confirmar
          </Button>
        </Footer>
      </Section>
    </Container>
  )
}