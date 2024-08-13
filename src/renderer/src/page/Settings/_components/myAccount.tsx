import { Button, ContentInRow, Separator } from "@renderer/styles/global";
import { Input, Label, WrapIpunt } from "../styles";
import { formatCNPJandCPF, formatDate } from "@shared/utils";
import { useEffect, useState } from "react";
import { Notification } from "@renderer/components/notification";
import { Loading } from "@renderer/components/loading";

type accountProps = {
    AccountId: string,
    AccountHolderId: string,
    Account: string,
    Branch: string,
    Cnpj: string,
    Phone: string,
    CreatedAT: string,
    Status: string
}
type Props = {
    acc: accountProps
}

const win: any = window

export function MyAccount({acc}: Props) {
    const [account, setAccount] = useState(acc)
    const [isLoad, setIsLoad] = useState(false)
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({
        message: '',
        type:  '' as "error" | "warning" | "info" | "confirm" | "custom",
    })

    async function getAccount() {
        const data = await win.api.getAccount()
        setAccount(data)
    }

    const handleVerifyAccount = async () => {
        setIsLoad(true)
        const verify = await win.api.verifyAccount()
        if(verify == 'UPDATED') {
            getAccount()
        } else if(verify == 'RELOAD') {
            setNotification({
                message: 'Sua conta foi atualizada!',
                type: 'info'
            })
        } else {
            setNotification({
                message: 'Houve um erro ao tentar verificar a conta, tente novamente!',
                type: 'error'
            })
            setShowNotification(true)
        }
        setIsLoad(false)
    }

    const handleDeleteAccount = async () => {
        setIsLoad(true)
        const del = await win.api.deleteAccount()
        // if(del == 'DELETED') {
        //     setNotification({
        //         message: 'Sua conta foi deletada com sucesso!',
        //         type: 'warning'
        //     })
        // } else {
        //     setNotification({
        //         message: 'Houve um erro ao tentar deletar a conta, tente novamente!',
        //         type: 'error'
        //     })
        // }
        // setShowNotification(true)
        console.log(del)
        setIsLoad(false)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', paddingLeft: 40, paddingRight: 40, gap: 15}}>
            { isLoad && <Loading /> }
            <h1> Meus Dados</h1>
            <WrapIpunt>
                <Label>ID da Conta</Label>
                <Input type="text" value={account.AccountId}/>
            </WrapIpunt>

            <WrapIpunt>
                <Label>CNPJ</Label>
                <Input type="text" value={formatCNPJandCPF(account.Cnpj as string)} style={{width: 140}}/>
            </WrapIpunt>

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

            <WrapIpunt>
                <Label>Status da Conta</Label>
                <Input type="text" value={account?.Status} style={{width: 120, textAlign: 'center'}}/>
            </WrapIpunt>

            <WrapIpunt>
                <Label>Data de Criação</Label>
                <Input type="text" value={formatDate(account.CreatedAT as string)} style={{width: 120, textAlign: 'center'}}/>
            </WrapIpunt>

            <Separator />

            <ContentInRow>
                <Button onClick={handleVerifyAccount}>Verificar</Button>
                <Button style={{backgroundColor: 'red'}} onClick={handleDeleteAccount}>Excluir Conta</Button>
            </ContentInRow>

            <Notification
            type={notification.type}
            show={showNotification}
            onClose={() => setShowNotification(!showNotification)}
            message={notification.message}
            />
        </div>
    )
}