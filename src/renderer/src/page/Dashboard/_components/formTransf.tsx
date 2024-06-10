/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Button, TextArea, Card, CardContent, CardFooter, CardHeader, CardTitle, Container, ContentInRow, FormInput, Input, Label, Separator } from "../../../styles/global";
import { DialogExtract } from "./DialogExtract";
import { DetailContent, RowDetails } from "../styles";
import { DialogRefund } from "./DialogRefund";

const win: any = window

type BalanceProps = {
    balance: any,
    extract: any[]
}

export function FormTransf({balance, extract}: BalanceProps) {
    const [dialogExtractOpen, setDialogExtractOpen] = useState(false)
    const [dialogRefundOpen, setDialogRefundOpen] = useState(false)

    function toggleExtractDialog() {
        setDialogExtractOpen(!dialogExtractOpen)
    }

    function toggleRefundDialog() {
        setDialogRefundOpen(!dialogRefundOpen)
    }

    function saveInDb() {
        win.api.verifyAccount()
    }

    // async function verifyAccount() {
    //     const token = sessionStorage.getItem('token')
    //     await  (window as any).api.verifyAccount(token)
    // }

    function showBalance() {
        return balance.available ?
        `R$  ${Number(balance.available).toFixed(2) || 0 }`
        :
        'Carregando ...'
    }

    return(
        <Container style={{paddingLeft: 15, paddingRight: 15}}>
            <ContentInRow >
                <div style={{display: 'flex', flexDirection: 'column', width: '50%', gap: 25}}>
                    <Card style ={{width: '100%', height: 430}}>
                        <CardHeader>
                            <CardTitle> Area de Transferência </CardTitle>
                            <Separator/>
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
                                <ContentInRow style={{justifyContent: 'flex-start', alignItems: 'center', gap: 5}}>
                                    <span style={{fontSize: 20, fontWeight: 600}}>R$</span>
                                    <Input type="number" style={{textAlign: 'end', paddingRight: 20, fontSize: 20}} />
                                </ContentInRow>
                            </FormInput>

                            <FormInput>
                                <Label>Informações para o Recebedor (opcional)</Label>
                                <TextArea />
                            </FormInput>

                            <Button onClick={saveInDb} > Confirmar </Button>          
                        </CardContent>
                    </Card>

                    <Card style={{width: '100%',}}>
                        <FormInput style={{width: '100%'}}>
                            <Label>Saldo Atual</Label>
                            <Input style={{textAlign: 'end', fontWeight: '900'}} readOnly value={showBalance()}/>
                        </FormInput>
                    </Card>
                </div>
                
                <Card style ={{width: '45%', height: 560}}>
                    <CardHeader>
                        <CardTitle> Movimentações Recentes </CardTitle>
                        <Separator/>
                    </CardHeader>

                    <CardContent style={{ justifyContent: 'flex-start', height: '80%' }}>
                        <Label>Transferências</Label>
                        <div style={{ width: '100%',}}>
                            {
                                extract.map((data: any, i) => (
                                    i < 10 &&
                                    <RowDetails>
                                        <p>{data.description}</p>
                                        <DetailContent style={{ color: data.type !== 'C' ? 'red' : 'green'}}>
                                            <p>{data.type !== 'C' ? '-' : ''}</p>
                                            <p style={{fontWeight: '700'}}>R$ {data.amount.toFixed(2)}</p>
                                        </DetailContent>
                                    </RowDetails>
                                ))
                            }
                        </div>
                    </CardContent>

                    <CardFooter style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button onClick={toggleExtractDialog}> Extrato </Button>
                        <Button style={{backgroundColor: 'red'}} onClick={toggleRefundDialog}> Devolucao </Button>
                    </CardFooter>
                </Card>
            </ContentInRow>
            { dialogExtractOpen && <DialogExtract toggle={toggleExtractDialog} /> }
            { dialogRefundOpen && <DialogRefund toggle={toggleRefundDialog} /> }

        </Container>
    )
}