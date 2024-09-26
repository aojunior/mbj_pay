import { useEffect, useState } from 'react'
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
import { useNotification } from '@renderer/context/notification.context'

const win: any = window

export default function CreateAccount() {
  const navigate = useNavigate()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const pages = [0, 1, 2]
  const [select, setSelect] = useState(0)
  const [isLoad, setIsLoad] = useState(false)

  const [companyData, setCompanyData] = useState({
    companyAddress: 'rua galaxia',
    companyAddressComplement: '',
    companyAddressNumber: '272',
    companyNeighborhood: 'Jardim da Gloria',
    companyCodezip: '03254770',
    companyState: 'SP',
    companyCity: 'Cotia',
    companyDateCreated: '01/05/2020',
    companyDocument: '81667817000110',
    companyEmailAddress: 'empresa@email.com',
    companyName: 'Empresa Teste',
    companyPhoneNumber: '1127024478'
  } as z.infer<typeof companySchema>)

  const [ownerData, setOwnerData] = useState({
    ownerAddress: 'rua galaxia',
    ownerAddressComplement: '',
    ownerAddressNumber: '272',
    ownerNeighborhood: 'Jardim da Gloria',
    ownerCodezip: '03254770',
    ownerState: 'SP',
    ownerCity: 'Cotia',
    ownerBirthday: '01/05/1994',
    ownerDocument: '13585366864',
    ownerEmailAddress: 'cliente@email.com',
    ownerName: 'Cliente Teste',
    ownerMotherName: 'Mae Cliente',
    ownerPhoneNumber: '1127024478'
  } as z.infer<typeof ownerSchema>)

  const [bankData, setBankData] = useState({} as z.infer<typeof bankSchema>)

  async function onSubmit() {
    if (bankData.password.length < 4) {
      setIsLoad(true)
      setContentNotification({
        ...contentNotification,
        title: "Necessário criar uma Senha",
        message: 'Por favor, preencha o campo de senha com no mínimo 4 caracteres',
        type: 'error'
      })
      setShowNotification(true)
      setIsLoad(false)
      return
    }
    setIsLoad(true)
    const formatDateForSubmission = (date) => {
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    }
    const concatAccount = { ...companyData, ...ownerData, ...bankData }
    concatAccount.companyDateCreated = formatDateForSubmission(companyData.companyDateCreated)
    concatAccount.companyDocument = companyData.companyDocument.replace(/\D/g, '')
    concatAccount.companyPhoneNumber = companyData.companyPhoneNumber.replace(/\D/g, '')

    concatAccount.ownerBirthday = formatDateForSubmission(ownerData.ownerBirthday)
    concatAccount.ownerDocument = ownerData.ownerDocument.replace(/\D/g, '')
    concatAccount.ownerPhoneNumber = ownerData.ownerPhoneNumber.replace(/\D/g, '')
    let resp = await win.api.createAccount(concatAccount)
    setIsLoad(false)
    if (resp == 1) {
      setContentNotification({
        ...contentNotification,
        title: 'Conta criada com sucesso!',
        message: 'Sua conta foi criada com sucesso!',
        type: 'confirm'
      })
      setShowNotification(true)
      setTimeout(() => navigate('/account/complete'), 2000)
    } else {
      setContentNotification({
        ...contentNotification,
        title: 'Erro!',
        message: 'Houve um erro ao tentar criar a conta, tente novamente!',
        type: 'error'
      })
      setShowNotification(true)
    }
  }

  // useEffect(() => {
  //   navigate('/account/terms')
  // }, [])

  return (
    <>
      {isLoad && <Loading />}
      {/* <Progress data={pages[select]} />

      <Container style={{ backgroundColor: '#0', height: 600 }}>
        {pages[select] == 0 && (
          <FormCompany companyData={companyData} setCompanyData={setCompanyData} />
        )}
        {pages[select] == 1 && <FormOwner ownerData={ownerData} setOwnerData={setOwnerData} />}
        {pages[select] == 2 && <FormBank bankData={bankData} setBankData={setBankData} />}
      </Container>

      <ContentInRow
        style={
          pages[select] === 0 ? { justifyContent: 'flex-end', width: '80%' } : { width: '90%' }
        }
      >
        {pages[select] > 0 && <Button onClick={() => setSelect(select - 1)}> Voltar </Button>}
        {pages[select] < 2 ? (
          <Button onClick={() => setSelect(select + 1)}> Continuar </Button>
        ) : (
          <Button onClick={onSubmit}> Finalizar </Button>
        )}
      </ContentInRow> */}
      <Notification />
    </>
  )
}
