/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import {
  Button,
  TextArea,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  ContentInRow,
  FormInput,
  Input,
  Label,
  Separator
} from '../../../styles/global'
import { DialogExtract } from './DialogExtract'
import { DetailContent, RowDetails } from '../styles'
import { DialogRefund } from './DialogRefund'
import { maskCurrencyInput } from '@shared/utils'
import { ShowPassword } from '@renderer/components/password'
import { useSecurity } from '@renderer/context/security.context'
import { Notification } from '@renderer/components/notification'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window

type BalanceProps = {
  balance: any
  extract: any[]
}

export function FormTransf({ balance, extract }: BalanceProps) {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { confirmed, setConfirmed, showSecurity, setShowSecurity } = useSecurity()
  const [dialogExtractOpen, setDialogExtractOpen] = useState(false)
  const [dialogRefundOpen, setDialogRefundOpen] = useState(false)
  const [amount, setAmount] = useState<Number>(0)
  
  const handleCurrencyChange = (event) => {
    maskCurrencyInput(event);
    setAmount(event.target.value.replace(/\D/g, '')/100)
  };

  function toggleExtractDialog() {
    setDialogExtractOpen(!dialogExtractOpen)
  }

  function toggleRefundDialog() {
    setDialogRefundOpen(!dialogRefundOpen)
  }

  function handleTransactionToOwnAccount() {
    if(handleTransactionBalance()) {
      console.log(amount)
      // win.api.verifyAccount()
      setContentNotification({
        ...contentNotification,
        type: 'confirm',
        title: 'Transferência Realizada com Sucesso',
        message: 'Sua transferência foi realizada'
      })
      setShowNotification(true)
    }
  }

  function handleTransactionBalance() {
    if(balance?.available) {
      switch(balance?.available) {
        case balance?.available < amount:
          setContentNotification({
            ...contentNotification,
            type: 'warning',
            title: 'Não foi Possível Prosseguir',
            message: 'Saldo Insuficiente para Transferêcia!'
          })
          setShowNotification(true)
          return false
        case balance?.available >= amount:
          return true
        default:
          return 'Transferência efetuada com sucesso!'
      }
    } else {
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Erro de Conexão',
        message: 'Houve um erro na transferência, tente novamente!'
      })
      setShowNotification(true)
      return false
    }
  }

  function showBalance() {
    return balance?.available ? `R$  ${Number(balance?.available).toFixed(2) || 0}` : 'Carregando ...'
  }

  useEffect(() => {
    setConfirmed(false)
  }, [])

  useEffect(() => {
    if(confirmed) {
      handleTransactionToOwnAccount()
    }
  }, [confirmed])

  return (
    <Container style={{ paddingLeft: 15, paddingRight: 15 }}>
      {
        showSecurity &&
        <ShowPassword />
      }
      <ContentInRow>
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 25 }}>
          <Card style={{ width: '100%', height: 430 }}>
            <CardHeader>
              <CardTitle> Transferência via PIX </CardTitle>
              <Separator />
            </CardHeader>

            <CardContent>
              <FormInput>
                <Label>Selecione a Conta:</Label>
                <select>
                  <option value="">- SELECT -</option>
                  <option value=""> ITAU S.A</option>
                  <option value=""> BANCO INTER</option>
                  <option value=""> NUBANK</option>
                </select>
              </FormInput>

              <FormInput>
                <Label>Informe o Valor:</Label>
                  <Input
                    style={{ textAlign: 'end', paddingRight: 20, fontSize: 20 }}
                    onChange={handleCurrencyChange}
                    placeholder="R$ 0,00"
                  />
              </FormInput>

              <FormInput>
                <Label>Informações para o Recebedor (opcional)</Label>
                <TextArea />
              </FormInput>

              <Button onClick={()=>setShowSecurity(true)}> Confirmar </Button>
            </CardContent>
          </Card>

          <Card style={{ width: '100%' }}>
            <FormInput style={{ width: '100%' }}>
              <Label>Saldo Disponível </Label>
              <Input
                style={{ textAlign: 'end', fontWeight: '900' }}
                readOnly
                value={showBalance()}
              />
            </FormInput>
          </Card>
        </div>

        <Card style={{ width: '45%', height: 560 }}>
          <CardHeader>
            <CardTitle> Movimentações Recentes </CardTitle>
            <Separator />
          </CardHeader>

          <CardContent style={{ justifyContent: 'flex-start', height: '80%' }}>
            <Label>Extrato</Label>
            <div style={{ width: '100%' }}>
              {extract.map(
                (data: any, i) => i < 10 && (
                  <RowDetails>
                    <p>{data.description}</p>
                    <DetailContent style={{ color: data.type !== 'C' ? 'red' : 'green' }}>
                      <p>{data.type !== 'C' ? '-' : ''}</p>
                      <p style={{ fontWeight: '700' }}>R$ {data.amount.toFixed(2)}</p>
                    </DetailContent>
                  </RowDetails>
                )
              )}
            </div>
          </CardContent>

          <CardFooter style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button onClick={toggleExtractDialog}> Extrato </Button>
            <Button 
              style={{ backgroundColor: 'red' }} 
              onClick={toggleRefundDialog}
            >
              Devolução
            </Button>
          </CardFooter>
        </Card>
      </ContentInRow>
      {dialogExtractOpen && <DialogExtract toggle={toggleExtractDialog} />}
      {dialogRefundOpen && <DialogRefund toggle={toggleRefundDialog} />}

      <Notification />
    </Container>
  )
}
