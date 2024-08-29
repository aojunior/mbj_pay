import { styled } from 'styled-components'
import { IoIosWarning } from 'react-icons/io'
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import { Input } from '@renderer/styles/global'
import { useEffect, useState } from 'react'
import { ContantRow } from '@renderer/page/Home/StandBy/styles'

const Container = styled.dialog`
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(2px);
  background: #00000050;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Section = styled.div`
  width: 50%;
  height: 250px;
  background-color: #fff;
  border: 1px solid #e7e7e4;
  border-radius: 8px;
  display: flex;
  padding: 20px 0;
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
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
  margin-top: 40px;
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

export function ShowPassword() {
    const [showPassword, setShowPassword] = useState(false)
    function checkPassword(event) {
        switch (event.key || event) {
            case 'Enter':  
                console.log('Checking password')
            break
        }
    }
    
    function togglePassword() {
        setShowPassword(!showPassword)
    }

    useEffect(() => {
        window.addEventListener('keydown', checkPassword)
        return () => {
            window.removeEventListener('keydown', checkPassword)
          }
    },[])

    return (

        <Container>
            <Section>
                <Header>
                    <Title>Confirmação de senha</Title>
                    <IoIosWarning size={28} color="#FFA500" />
                </Header>
                <p>Para contiuar, digite sua senha:</p>
                <ContantRow style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Input style={{width: '75%'}} type={showPassword ? "text":"password"} placeholder="Confirme a senha" />
                    {
                    showPassword ?
                    <AiFillEyeInvisible size={24} color='#4f4f4f' onClick={togglePassword} style={{cursor: 'pointer'}} />
                    :
                    <AiFillEye size={24} color='#4f4f4f' onClick={togglePassword} style={{cursor: 'pointer'}} />
                    }
                </ContantRow>

                <Footer>
                    <Button
                        onClick={() => checkPassword('Enter')}
                    >
                        Confirmar
                    </Button>
                </Footer>
            </Section>
        </Container>
    )
}