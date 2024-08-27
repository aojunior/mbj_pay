import { styled } from 'styled-components'
import { IoIosWarning } from 'react-icons/io'
import { GiConfirmed } from 'react-icons/gi'

const Container = styled.dialog`
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(2px);
  background: #00000050;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AlertContainer = styled.div`
  width: 50%;
  height: 250px;
  background-color: #fff;
  border: 1px solid #e7e7e4;
  border-radius: 8px;
  display: flex;
  padding: 20px 0;
  flex-direction: column;
`

const AlertHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const AlertTitle = styled.h2`
  font-weight: 600;
`

const AlertContent = styled.section`
  text-align: center;
  flex: 1;
  font-size: 18px;
`

const AlertMessage = styled.p``

const AlertDisclaimer = styled.p`
  font-style: italic;
  font-size: 12px;
  color: #9a9a9a;
`

const AlertFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
`

const Button = styled.button`
  border: 1px solid #e4e4e7;
  font-weight: 600;
  background-color: #fff;
  padding: 5px;
  border-radius: 4px;
  font-size: 16px;
  color: #444;
  &:hover {
    cursor: pointer;
  }
`

type Props = {
  title: string
  message: string
  messageAdd?: string
  nameButton: string
  colorButton?: string
  typeButton?: 'delete' | 'confirm'
  toggle?: () => void
  actionButton?: () => void
}

export function Alert({
  message,
  title,
  messageAdd,
  nameButton,
  typeButton,
  colorButton,
  toggle,
  actionButton
}: Props) {
  return (
    <Container id="Dialog">
      <AlertContainer>
        <AlertHeader>
          {typeButton == 'delete' && <IoIosWarning size={32} color="#ffc241" />}
          {typeButton == 'confirm' && <GiConfirmed size={32} color="#558128" />}
          <AlertTitle>{title}</AlertTitle>
        </AlertHeader>
        <AlertContent>
          <AlertMessage>{message}</AlertMessage>
          <AlertDisclaimer>{messageAdd}</AlertDisclaimer>
        </AlertContent>
        <AlertFooter>
          <Button onClick={toggle}>Cancelar</Button>
          {typeButton == 'delete' ? (
            <Button style={{ backgroundColor: '#e14949', color: '#FFF' }} onClick={actionButton}>
              {nameButton}
            </Button>
          ) : typeButton == 'confirm' ? (
            <Button
              color={colorButton}
              style={{ backgroundColor: '#a6ff4d', color: '#558128' }}
              onClick={actionButton}
            >
              {nameButton}
            </Button>
          ) : (
            <Button color={colorButton} onClick={actionButton}>
              {nameButton}
            </Button>
          )}
        </AlertFooter>
      </AlertContainer>
    </Container>
  )
}
