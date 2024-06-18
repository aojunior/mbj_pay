
import { useState } from 'react'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Progress } from './_components/Progress'
import { FormCompany } from './_components/formCompany'
import { FormOwner } from './_components/formOwner'
import { FormBank } from './_components/formBank'
import { bankSchema, companySchema, ownerSchema } from './schema'
import { Button, Container, ContentInRow } from '../../styles/global'
import { Notification } from '@renderer/components/notification'
import { Loading } from '@renderer/components/loading'
const win: any = window

export default function CreateAccount() {
  const navigate = useNavigate()
  const pages = [0, 1, 2]
  const [select, setSelect] = useState(0)
  const [isLoad, setIsLoad] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    type:  '' as "error" | "warning" | "info" | "confirm" | "custom",
  })
  const [showNotification, setShowNotification] = useState(false);

  const [companyData, setCompanyData] = useState({
    companyAddress: 'rua galaxia',
    companyAddressComplement: '',
    companyAddressNumber: '272',
    companyNeighborhood: 'Jardim da Gloria',
    companyCodezip: '03254770',
    companyState: 'SP',
    companyCity: 'Cotia',
    companyDateCreated: '2020-05-01',
    companyDocument: '81667817000110',
    companyEmailAddress: 'empresa@email.com',
    companyName: 'Empresa Teste',
    companyPhoneNumber: '1127024478',

  } as z.infer<typeof companySchema>)

  const [ownerData, setOwnerData] = useState({
    ownerAddress: 'rua galaxia',
    ownerAddressComplement: '',
    ownerAddressNumber: '272',
    ownerNeighborhood: 'Jardim da Gloria',
    ownerCodezip: '03254770',
    ownerState: 'SP',
    ownerCity: 'Cotia',
    ownerBirthday: '1995-05-01',
    ownerDocument: '13585366864',
    ownerEmailAddress: 'cliente@email.com',
    ownerName: 'Cliente Teste',
    ownerMotherName: 'Mae Cliente',
    ownerPhoneNumber: '1127024478'
  } as z.infer<typeof ownerSchema>)
 
  const [bankData, setBankData] = useState({} as z.infer<typeof bankSchema>)

  async function sendData() {
    setIsLoad(true)
    const concatAccount = {...companyData, ...ownerData, ...bankData}
    let resp = await win.api.createAccount(concatAccount)
    setIsLoad(false)
    if(resp == 1) {
      setNotification({
        message: 'Sua conta foi criada com sucesso!',
        type: 'confirm'
      })
      setShowNotification(true)
      setTimeout(() => navigate('/finalization'), 2000)
    } else {
      setNotification({
        message: 'Houve um erro ao tentar criar a conta, tente novamente!',
        type: 'error'
      })
      setShowNotification(true)
    }
  }

  return (
    <>
    {isLoad && <Loading />}
      <Progress data={pages[select]}/>
        <Container style={{backgroundColor: '#0', height: 650}}>
          {pages[select] == 0 && <FormCompany companyData={companyData} setCompanyData={setCompanyData} />}
          {pages[select] == 1 && <FormOwner ownerData={ownerData} setOwnerData={setOwnerData}/>}
          {pages[select] == 2 && <FormBank bankData={bankData} setBankData={setBankData} />}
        </Container>
      
        <ContentInRow style={pages[select] === 0 ? {justifyContent:  'flex-end', width: '80%'  }:{width: '90%'}}>
          { pages[select] > 0 &&
            <Button onClick={() => setSelect(select - 1)}> Voltar </Button>
          }
          { pages[select] < 2 ?
            <Button  onClick={() => setSelect(select + 1)}> Continuar </Button> 
            :
            <Button  onClick={() => sendData()}> Finalizar </Button>
          }
        </ContentInRow>

        <Notification 
          message={notification.message}
          show={showNotification}
          type={notification.type}
          onClose={() => setShowNotification(!showNotification)}
        />
    </>
  )
}
