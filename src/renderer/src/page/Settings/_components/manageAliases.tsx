import { Button } from "@renderer/styles/global";
import { DeleteIcon, Section, Table, Tbody, Td, Th, Thead, Tr } from "../styles";
import { useEffect, useState } from "react";
import { Loading } from "@renderer/components/loading";
import { Notification } from "@renderer/components/notification";
import { useAccount } from "@renderer/context/account.context";

type aliasProps = {
    Data: any
}

const win: any = window

export function ManageAlias({Data}: aliasProps) {
    const { accState } = useAccount()
    const [aliasData, setAliasData] = useState(Data)
    const [isLoad, setIsLoad] = useState(false)
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({
        message: '',
        type:  '' as "error" | "warning" | "info" | "confirm" | "custom",
    })

    const handleCreateAccount = async () => {
        setIsLoad(true)
        let create = await win.api.createAlias()
        setNotification({
            message: 'Sua chave Pix foi criada com sucesso!',
            type: 'confirm'
        })
        setShowNotification(true)
        setIsLoad(false)
        return create
    }

    const handleDeleteAlias = async (alias) => {
        setIsLoad(true)
        const del = await win.api.deleteAlias(alias)
        let resp = await win.api.verifyAlias()
        setAliasData(resp)
        setNotification({
            message: 'Sua chave Pix foi deletada com sucesso!',
            type: 'warning'
        })
        setShowNotification(true)
        setIsLoad(false)
        return del
    }

    const handleKeyButton = async (event) => {
        switch(event.key || event) {
          case 'F5':
            setIsLoad(true)
            if(accState.Status == 'Active') {
                await win.api.updateAlias()
                let resp = await win.api.verifyAlias()
                setAliasData(resp) 
                setNotification({
                    message: 'Chave Pix atualizada com sucesso!',
                    type: 'info'
                })
                setShowNotification(true)
            }
            setIsLoad(false)
          break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyButton);
        return () => {
          window.removeEventListener('keydown', handleKeyButton);
        };
    }, []);

    return (
        <div style={{display: 'flex', flexDirection: 'column', paddingLeft: 40, paddingRight: 40, gap: 15}}>
            <Button style={{position: 'absolute', right: 40, top: 150}} onClick={() => handleKeyButton('F5')} ><code>F5</code> - Atualizar</Button>
            {isLoad && <Loading />}
            <h1> Chave Pix </h1>
            <> 
            <Table>
                <Thead>
                    <Tr>
                        <Th>Status</Th>
                        <Th>Chave</Th>
                        <Th>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {aliasData.map(data =>
                    <Tr>
                        <Td>{data.Status}</Td>
                        <Td>{data.Alias}</Td>
                        <Td>
                            <DeleteIcon size={24} onClick={() => handleDeleteAlias(data.Alias)}/>
                        </Td>
                    </Tr>
                )}
                </Tbody>
            </Table>

            <span style={{color: '#999', textAlign: 'end'}}>{aliasData.length}/5</span>

            {
                accState.Status == 'Active' &&
                <Button  onClick={handleCreateAccount}>
                    Add Chave
                </Button>
            }
            </>   
            
            <Notification
            type={notification.type}
            show={showNotification}
            onClose={() => setShowNotification(!showNotification)}
            message={notification.message}
            />
        </div>
    )
}