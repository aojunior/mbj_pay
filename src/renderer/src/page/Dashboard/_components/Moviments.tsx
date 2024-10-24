/* eslint-disable prettier/prettier */
import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Separator,

} from '../../../styles/global'
import { DialogExtract } from './DialogExtract'
import { DetailContent, RowDetails } from '../styles'
import { DialogRefund } from './DialogRefund'

export function MovimentsToday({ extract }) {
  const [dialogExtractOpen, setDialogExtractOpen] = useState(false)
  const [dialogRefundOpen, setDialogRefundOpen] = useState(false)
  
  function toggleExtractDialog() {
    setDialogExtractOpen(!dialogExtractOpen)
  }
  function toggleRefundDialog() {
    setDialogRefundOpen(!dialogRefundOpen)
  }

  return (
    <Card style={{ width: '45%', height: 560 }}>
        <CardHeader>
        <CardTitle> Movimentações Recentes </CardTitle>
        <Separator />
        </CardHeader>

        <CardContent style={{ justifyContent: 'flex-start', height: '80%' }}>
        <Label>Extrato</Label>
        <div style={{ width: '100%', overflowY: 'auto' }}>
            {extract.map(
            (data: any, i) =>
                i < 10 && data.description !== 'DEBITO TARIFA PIX INCUBADORA' && (
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

        <CardFooter style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
        <Button onClick={toggleExtractDialog}> Extrato </Button>
        <Button style={{ backgroundColor: 'red' }} onClick={toggleRefundDialog}>
            Devolução
        </Button>
        </CardFooter>

        {dialogExtractOpen && <DialogExtract toggle={toggleExtractDialog} />}
        {dialogRefundOpen && <DialogRefund toggle={toggleRefundDialog} />}
    </Card>
  
  )
}
