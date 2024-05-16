/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { Progress } from './_components/Progress'
import { FormBusiness } from './_components/formBusiness'
import { FormClient } from './_components/formClient'
import { Button, Container, ContentInRow } from './styles'

export default function UserRegister() {
  const pages = [1, 2, 3]
  const [select, setSelect] = useState(0)

  return (
    <Container >
      <Progress />
      {pages[select] == 1 && <FormBusiness />}
      {pages[select] == 2 && <FormClient />}

      <ContentInRow >
        {
          pages[select] > 1 &&
            <Button onClick={() => setSelect(select - 1)}> Voltar </Button>
        }
        <Button onClick={() => setSelect(select + 1)}> Avançar </Button>
      </ContentInRow>
    </Container>
  )
}
