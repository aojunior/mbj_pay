import { Button, ContentInRow, Separator } from "@renderer/styles/global";
import { Input, Label } from "../styles";
import { formatCNPJandCPF, formatDate } from "@shared/utils";
import { useState } from "react";
import { Notification } from "@renderer/components/notification";

const win: any = window

type accountProps = {
    AccountId: string,
    AccountHolderId: string,
    Account: string,
    Branch: string,
    Cnpj: string,
    Phone: string,
    Date: string,
    Status: string
}

type accProps = {
    acc: accountProps
}

export function MyAccount({acc}: accProps) {
    const [account, setAccount] = useState(acc)
    const [load, setLoad] = useState(false)
    const [showNotification, setShowNotification] = useState(false);

    const handleVerifyAccount = async () => {
        setLoad(true)
        const verify = await win.api.verifyAccount()
        
        setLoad(false)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: 40}}>
            <h1> Meus Dados</h1>

            <Label>ID da Conta</Label> 
            <Input type="text" value={account?.AccountId}/>   

            <Label>CNPJ</Label> 
            <Input type="text" value={formatCNPJandCPF(account.Cnpj as string)} style={{width: 140}}/>   

            <ContentInRow style={{width: '40%'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Label>Conta</Label> 
                    <Input type="text" value={account.Branch} style={{width: 120}}/>   
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Label>Filial (Branch)</Label> 
                    <Input type="text" value={account.Account} style={{width: 120}}/>   
                </div>
            </ContentInRow>

            <Label>Status da Conta</Label> 
            <Input type="text" value={account?.Status} style={{width: 120}}/>   

            <Label>Data de Criação</Label> 
            <Input type="text" value={formatDate(account.Date as string)} style={{width: 120}}/>   

            <Separator />

            {
                account.Status !== 'REGULAR' &&
                <Button onClick={handleVerifyAccount}>{ load ? 'Carregando' : 'Verificar Conta'} </Button> 
            }

            <Notification
            type='error'
            show={showNotification}
            onClose={() => setShowNotification(!showNotification)}
            message="Error when trying to connect to the server" 
            />
        </div>
    )
}