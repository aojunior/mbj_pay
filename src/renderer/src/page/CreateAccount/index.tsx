/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { Progress } from './_components/Progress'
import { FormBusiness } from './_components/formBusiness'
import { FormClient } from './_components/formClient'
import { Button, Container, ContentInRow } from '../../styles/global'
import { FormBank } from './_components/formBank'

export default function UserRegister() {
  const pages = [0, 1, 2]
  const [select, setSelect] = useState(0)

  return (
    <>
      <Progress data={pages[select]}/>
      <Container >
        {pages[select] == 0 && <FormBusiness />}
        {pages[select] == 1 && <FormClient />}
        {pages[select] == 2 && <FormBank />}

      </Container>
      
        <ContentInRow style={pages[select] === 0 ? {justifyContent:  'flex-end', width: '80%'}:{width: '90%'}}>
          {
            pages[select] > 0 &&
              <Button onClick={() => setSelect(select - 1)}> Voltar </Button>
          }
          {
            pages[select] < 2 &&
            <Button  onClick={() => setSelect(select + 1)}> Continuar </Button>
          }
        </ContentInRow>
    </>
  )
}
