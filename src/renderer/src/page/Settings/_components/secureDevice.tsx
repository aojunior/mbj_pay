import { Button, Container } from "@renderer/styles/global"
import { DeleteIcon, Table, TableWrapper, Tbody, Td, Th, Thead, Title, Tr } from "../styles";
import { useSecurity } from "@renderer/context/security.context";
import { useEffect, useState } from "react";
import { OptCode } from "@renderer/components/opt-code";
import { useUtils } from "@renderer/context/utils.context";
import { useLoading } from "@renderer/context/loading.context";

const win: any = window
export function SecureDevice() {
    const { callSecurityButton, security, cleanUpSecurity } = useSecurity()
    const { setIsLoading } = useLoading()
    const { confirm, setConfirm } = useUtils()
    const [deviceList, setDeviceList] = useState<any>([])
    const [deviceRegistered, setDeviceRegistered] = useState(false)    

    async function onUnregister() {
        alert('deleted')
        cleanUpSecurity()
    }

    async function onRegister() {
        await win.api.registerDevice()
        await onLoad()
    }

    async function onLoad() {
        setIsLoading(true)
        const infos = await win.api.getRegisterDevice()
        if(infos.result.find(d => d.deviceId === infos.device.deviceId)) {
            setDeviceRegistered(true)
        } else {
            setDeviceRegistered(false)
        }
        setDeviceList(infos.result)
        setIsLoading(false)        
    }

    useEffect(() => {
        if(security.confirmed && security.context === 'deleteDevice') {
            onUnregister() 
        }
    }, [security.confirmed])

    useEffect(() => {
        if(confirm) {
            onRegister()
            setConfirm(false)
        }
    }, [confirm])

    useEffect(() => {
        onLoad()
    }, [])
    
    return (
        <Container>
            <Title> Dispositivo Seguro </Title>
            <TableWrapper>
                <Table>
                    <Thead>
                    <Tr>
                        <Th>Device ID</Th>
                        <Th>Nome</Th>
                        <Th>Ações</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        { deviceList.map(data => 
                        <Tr key={data.id}>
                            <Td>{data.deviceId.slice(0, 18).padEnd(36, '*')}</Td>
                            <Td>{data.deviceName}</Td>
                            <Td>
                                <DeleteIcon
                                size={24}
                                onClick={() => {
                                    callSecurityButton('deleteDevice')
                                }}
                                />
                            </Td>
                        </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableWrapper>
            <span style={{ color: '#999', textAlign: 'end' }}>{deviceList.length}/3</span>

        
            <Button onClick={() => { callSecurityButton('registerDevice')}} 
            style={{width: 200, display: deviceRegistered ? 'none' : 'block' }}>Registrar este dispositivo como Seguro</Button>
            

            { security.confirmed && security.context === 'registerDevice' && <OptCode /> }

            <span style={{ color: '#999', textAlign: 'end' }}>
                Ao criar uma nova chave pix, deverá aguarda alguns minutos antes de usá-la, para que o
                banco central possa registrar a nova chave corretamente.
            </span>
        </Container>
    )
}