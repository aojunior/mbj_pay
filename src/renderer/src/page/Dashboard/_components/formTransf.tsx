/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Container, ContentInRow, FormInput, Input, Label, Separator } from "../../../styles/global";
import { TextArea } from "../styles";
import { DialogTransf } from "./DialogTransf";

export function FormTransf() {
    const [dialogOpen, setDialogOpen] = useState(false)

    function toggleDialog() {
        console.log(dialogOpen)
       setDialogOpen(!dialogOpen)
    }

    async function saveInDb() {
        
    }

    // async function verifyAccount() {
    //     const token = sessionStorage.getItem('token')
    //     await  window.api.verifyAccount(token)
    // }

    return(
        <Container>
            <ContentInRow >
                <Card style ={{width: '58%', height: 400}}>
                    <CardHeader>
                        <CardTitle> Transferir </CardTitle>
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
                            <Input type="number" style={{textAlign: 'end', paddingRight: 20, background: "https://static.thenounproject.com/png/101791-200.png"}}  />
                        </FormInput>

                        <FormInput>
                            <Label>Informacoes para o Recebedor (opcional)</Label>
                            <TextArea />
                        </FormInput>
                        
                        <ContentInRow>
                            <Button onClick={saveInDb} > Confirmar </Button>
                            <Button onClick={toggleDialog}> Extrato </Button>
                        </ContentInRow>
                    </CardContent>
                </Card>
                
                <Card style ={{width: '40%', height: 600}}>
                    <CardHeader>
                        <CardTitle> Contas </CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent style={{height: '85%', justifyContent: 'flex-end',}}>
                        <Label>Transferencias Recentes</Label>
                        <div style={{height: '80%', width: '100%',}}>
                            <p>Credito - R$ 2,00</p>
                        </div>

                        <FormInput style={{width: '100%'}}>
                            <Label>Saldo Atual</Label>
                            <Input style={{textAlign: 'end', fontWeight: '900'}} readOnly value={`R$  40,00`}/>
                        </FormInput>
                    </CardContent>
                </Card>
            </ContentInRow>
            {dialogOpen &&
                <DialogTransf toggle={toggleDialog} />
            }
        </Container>
    )
}