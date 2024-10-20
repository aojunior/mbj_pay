import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Separator
} from '../../../styles/global'
import { DetailContent, Dialog, DialogContext, FilterPanel } from '../styles'
import { useNotification } from '@renderer/context/notification.context'
import { useLoading } from '@renderer/context/loading.context'
import { today } from '@shared/utils'

type dialogProps = {
  toggle: () => void
}
const win: any = window

export function DialogExtract({ toggle }: dialogProps) {
  const { setIsLoading } = useLoading()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [input, setInput] = useState('now')
  const dateFilter = { start: '', end: '' }
  const [extract, setExtract] = useState<any>([])

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

  useEffect(() => {
    filterExtract()
    window.addEventListener('keydown', handleKeyButton)
    return () => {
      window.removeEventListener('keydown', handleKeyButton)
    }
  }, [])

  return (
    <Dialog id="dialog">
      <DialogContext style={{ gap: 10 }}>
        <Card style={{ width: '100%' }}>
          <CardHeader>
            <CardTitle> Extrato / Transferencias </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <FilterPanel>
              <input
                type="radio"
                name="filter"
                id="now"
                value="now"
                checked={input == "now"}
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
              <Button onClick={() => handleKeyButton('F1')} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}> <code>F1</code> Buscar</Button>
            </FilterPanel>
          </CardContent>
        </Card>
        <Card style={{ width: '100%', height: 320 }}>
          <CardContent
            style={{ overflowY: 'scroll', height: '100%', justifyContent: 'flex-start' }}
          >
            {extract.map((item, i) => {
              return (
                item.description !== 'DEBITO TARIFA PIX INCUBADORA' &&
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    width: '90%',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Label style={{ fontSize: 16 }}>{formatDate(item.entryDate)}</Label> <br />
                  <Label style={{ fontSize: 16 }}>{item.description}</Label>
                  <br />
                  <DetailContent style={{ color: item.type !== 'C' ? 'red' : 'green' }}>
                    <p>{item.type !== 'C' ? '-' : ''}</p>
                    <p style={{ fontWeight: '700', fontSize: 18 }}>R$ {item.amount.toFixed(2)}</p>
                  </DetailContent>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Button onClick={toggle}> Fechar </Button>
      </DialogContext>
    </Dialog>
  )
}
