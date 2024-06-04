/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Container, ContentInRow, FormInput, Input, Label, Separator } from "../../../styles/global";
import { TextArea } from "../styles";
import { DialogTransf } from "./DialogTransf";
const win: any = window
export function FormTransf() {
    const [dialogOpen, setDialogOpen] = useState(false)

    function toggleDialog() {
        setDialogOpen(!dialogOpen)
    }

    function saveInDb() {
        win.api.verifyAccount()
    }

    // async function verifyAccount() {
    //     const token = sessionStorage.getItem('token')
    //     await  (window as any).api.verifyAccount(token)
    // }

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
                            <Input style={{textAlign: 'end', fontWeight: '900'}} readOnly value={`R$  ${(40).toFixed(2)}`}/>
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
                            <p>Credito - R$ 2,00</p>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button onClick={toggleDialog}> Extrato </Button>
                    </CardFooter>
                </Card>
            </ContentInRow>
            { dialogOpen && <DialogTransf toggle={toggleDialog} /> }
        </Container>
    )
}