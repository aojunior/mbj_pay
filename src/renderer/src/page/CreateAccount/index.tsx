
import { useState } from 'react'
import { z } from 'zod'
import { Progress } from './_components/Progress'
import { FormCompany } from './_components/formCompany'
import { FormOwner } from './_components/formOwner'
import { FormBank } from './_components/formBank'
import { bankSchema, companySchema, ownerSchema } from './schema'

import { Button, Container, ContentInRow } from '../../styles/global'

export default function UserRegister() {
  const pages = [0, 1, 2]
  const [select, setSelect] = useState(0)
  const [companyData, setCompanyData] = useState({} as z.infer<typeof companySchema>)
  const [ownerData, setOwnerData] = useState({} as z.infer<typeof ownerSchema>)
  const [bankData, setBankData] = useState({} as z.infer<typeof bankSchema>)

  function sendData() {
    const concatAccount = {...companyData, ...ownerData, ...bankData}
    const getToken = sessionStorage.getItem('token')
    window.api.createAccount(concatAccount, getToken)
  }

  return (
    <>
      <Progress data={pages[select]}/>
        <Container >
          {pages[select] == 0 && <FormCompany companyData={companyData} setCompanyData={setCompanyData} />}
          {pages[select] == 1 && <FormOwner ownerData={ownerData} setOwnerData={setOwnerData}/>}
          {pages[select] == 2 && <FormBank bankData={bankData} setBankData={setBankData} />}
        </Container>
      
        <ContentInRow style={pages[select] === 0 ? {justifyContent:  'flex-end', width: '80%'  }:{width: '90%'}}>
          {
            pages[select] > 0 &&
            <Button onClick={() => setSelect(select - 1)}> Voltar </Button>
          }
          {
            pages[select] < 2 ?
            <Button  onClick={() => setSelect(select + 1)}> Continuar </Button> 
            :
            <Button  onClick={() => sendData()}> Finalizar </Button>
          }
        </ContentInRow>
    </>
  )
}
