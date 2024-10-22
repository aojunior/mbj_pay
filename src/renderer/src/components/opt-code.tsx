import { styled } from 'styled-components'
import { IoIosMail } from 'react-icons/io'
import { AiFillCloseSquare } from 'react-icons/ai'
import { Input, LinkText } from '@renderer/styles/global'
import { useEffect, useState } from 'react'
import { useSecurity } from '@renderer/context/security.context'
import { useUtils } from '@renderer/context/utils.context'

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
  gap: 15px;
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
export function OptCode() {
  const { cleanUpSecurity } = useSecurity()
  const { setConfirm } = useUtils()
  const [optCode, setOptCode] = useState('')
  const [error, setError] = useState({
    message: '',
    borderColor: '#c4c4c7'
  })

  async function verifyCode() {
    const result = await win.api.verifyCode(optCode)
    if(result.data === true) {
      setConfirm(result.data)
      cleanUpSecurity()
    }
  }

  function handleChange(e) {
    setOptCode(e.target.value)
    setError({
      message: '',
      borderColor: '#c4c4c7'
    })
  }

  async function sendEmail() {
    await win.api.sendEmail()
  }

  useEffect(() => {
    sendEmail()
  }, [])

  return  (
      <Container>
        <Section>
          <AiFillCloseSquare style={{ alignSelf: 'flex-end', fontWeight: '700' }} color='#777' size={24} onClick={cleanUpSecurity} cursor='pointer'/>
          <Header>
            <Title>Verifique seu Email</Title>
            <IoIosMail size={28} color="#3178c6" />
          </Header>
          <p>Enviamos um código de confirmação para o email cadastrado:</p>
          <Input
            style={{ width: '30%', fontSize: 20, textAlign: 'center' }}
            type='number' 
            onChange={handleChange}
            autoFocus={true}
          />
          <LinkText >Reenviar codigo</LinkText>
          <Footer>
            <p style={{ color: 'red' }}>{error.message}</p>
            <Button onClick={verifyCode}>Enviar</Button>
          </Footer>
        </Section>
      </Container>
  )
}
