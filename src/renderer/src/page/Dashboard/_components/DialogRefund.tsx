/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormInput,
  Label,
  Separator
} from '../../../styles/global'
import { ContentSelect, DetailContent, Dialog, DialogContext, FilterPanel } from '../styles'
import { Alert } from '@renderer/components/alert'
import { useNotification } from '@renderer/context/notification.context'
import { useLoading } from '@renderer/context/loading.context'
import { useSecurity } from '@renderer/context/security.context'
import { useUtils } from '@renderer/context/utils.context'
import { today } from '@shared/utils'

type dialogProps = {
  toggle: () => void
}

const win: any = window
export function DialogRefund({ toggle }: dialogProps) {
  const { contentNotification, setContentNotification, setShowNotification  } = useNotification()
  const { security, callSecurityButton } = useSecurity()
  const { setIsLoading } = useLoading()
  const { openModal, toggleModal } = useUtils()
  
  const [arrCodes, setArrCodes] = useState<any>()
  const [reasonCodes, setReasonCodes] = useState('')
  const [input, setInput] = useState('now')  
  const dateFilter = { start: '', end: '' }
  const [extract, setExtract] = useState<any>([])
  const [openAlert, setOpenAlert] = useState(false)

  const [item, setItem] = useState<any>()

  const formatDate = (date: string) => {
    let format = date.split('T')
    let dateRaw = format[0].split('-')
    let hoursRaw = format[1].split('-')
    let dateFormated = `${dateRaw[2]}/${dateRaw[1]}/${dateRaw[0]}`
    let hoursFormated = hoursRaw[0]
    return dateFormated + ' ' + hoursFormated
  }

  function subtractDaysFromDate() {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    let d = date.toISOString()
    let dateFormat = d.split('T')
    return dateFormat[0]
  }

  async function filterExtract() {
    setIsLoading(true)
    let filter;
    if (input == 'other') {
      filter = await win.api.extractBalanceFilter(dateFilter.start, dateFilter.end)
    }
    if (input == '7day') {
      filter = await win.api.extractBalanceFilter(subtractDaysFromDate(), today)
    }
    if (input == 'now') {
      filter = await win.api.extractBalanceToday()
    }
    if(filter.message == 'success') {
      setExtract(filter.data.statement as any[])
    } else {    
      setExtract([])
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Houve um Erro',
        message: filter.message
      })
      setShowNotification(true)
    }
    setIsLoading(false)
  }


  const handleKeyButton = async (event) => {
    switch (event.key || event) {
      case 'F1':
        await filterExtract()
        break
    }
  }

  async function getRefundCodes() {
    setArrCodes(await win.api.refundCodes())
  }

  async function handleRefund(item) {
    if (reasonCodes == '') {
      setContentNotification({
        ...contentNotification,
        title: 'Selecione o motivo',
        message: 'O motivo da Devolução é obrigatório!',
        type: 'error'
      })
      setShowNotification(true)
      return
    }
    setItem(item)
    toggleAlert()
  }

  function toggleAlert() {
    setOpenAlert(!openAlert)
  }

  async function handleRefundConfirmed() {
    setIsLoading(true)
    const res = await win.api.refundInstantPayment(item, reasonCodes)
    console.log(res)
    setIsLoading(false)
  }

  useEffect(() => {
    getRefundCodes()
    filterExtract()
    window.addEventListener('keydown', handleKeyButton)
    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
  }, [])

  useEffect(() => {
    if (security.confirmed && security.context == 'refund') {
      setOpenAlert(false)
      handleRefundConfirmed()
    }
  }, [security.confirmed])

  return (
    <Dialog id="dialog">
      <DialogContext style={{ gap: 10 }}>
        <Card style={{ width: '100%' }}>
          <CardHeader>
            <CardTitle> Devolução Pagamento </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <FilterPanel>
              <FormInput>
                <Label>Selecione o Motivo:</Label>
                <select onChange={(e) => setReasonCodes(e.currentTarget.value)}>
                  <option value="">- SELECIONE -</option>
                  {arrCodes &&
                    arrCodes.map((data) => <option key={data.code} value={data.code}>{data.description}</option>)}
                </select>
              </FormInput>
              <input
                type="radio"
                name="filter"
                id="now"
                value="now"
                onChange={(e) => setInput(e.currentTarget.value)}
              />
              <Label htmlFor="now"> Dia Atual</Label> <br />
              <input
                type="radio"
                name="filter"
                id="7day"
                value="7day"
                onChange={(e) => setInput(e.currentTarget.value)}
              />
              <Label htmlFor="7day"> Últimos 7 dias</Label> <br />
              <input
                type="radio"
                name="filter"
                id="other"
                value="other"
                onChange={(e) => setInput(e.currentTarget.value)}
              />
              <Label htmlFor="other"> Outro Período: </Label>
              <br />
              {input == 'other' && (
                <div
                  style={{
                    gap: 15,
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 5,
                    marginBottom: 15
                  }}
                >
                  <Label style={{ fontSize: 12 }}> Data Inicial: </Label>
                  <input type="date" onChange={(e) => (dateFilter.start = e.currentTarget.value)} />
                  <Label style={{ fontSize: 12 }}> Data Final: </Label>
                  <input type="date" onChange={(e) => (dateFilter.end = e.currentTarget.value)} />
                </div>
              )}
              <Button onClick={() => handleKeyButton('F1')} style={{display: 'flex',  alignItems: 'center', justifyContent: 'space-evenly'}}> <code>F1</code> Buscar</Button>
            </FilterPanel>
          </CardContent>
        </Card>

        <Card style={{ width: '100%', height: 280 }}>
          <CardContent
            style={{ overflowY: 'scroll', height: '100%', justifyContent: 'flex-start' }}
          >
            {extract.map((item) => {
              return (
                item.type == 'C' && (
                  <ContentSelect onClick={() => handleRefund(item)}>
                    <Label style={{ fontSize: 16 }}>{formatDate(item.entryDate)}</Label> <br />
                    <Label style={{ fontSize: 16 }}>{item.description}</Label>
                    <br />
                    <DetailContent style={{ color: 'green' }}>
                      <p style={{ fontWeight: '700', fontSize: 18 }}>R$ {item.amount.toFixed(2)}</p>
                    </DetailContent>
                  </ContentSelect>
                )
              )
            })}
          </CardContent>
        </Card>
        <Button onClick={toggle}> Fechar </Button>
      </DialogContext>

      {openModal.modalName == 'alertRefund' && openModal.open && (
        <Alert
          title="Confirmar Devolução?"
          message="Deseja confirmar a devolução deste pagamento?"
          messageAdd="Este tipo de ação é irreversível."
          nameButton="Devolver"
          typeButton="delete"
          toggle={() => toggleModal('refund', !openModal.open)}
          actionButton={() => callSecurityButton('refund')}
        />
      )}
    </Dialog>
  )
}
