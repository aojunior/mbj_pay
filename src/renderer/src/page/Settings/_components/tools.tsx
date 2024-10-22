import { Button, Container } from "@renderer/styles/global"
import { DeleteIcon, Table, TableWrapper, Tbody, Td, Th, Thead, Title, Tr } from "../styles";
import { useSecurity } from "@renderer/context/security.context";

const win: any = window
export function Configs() {
    const { callSecurityButton } = useSecurity()
    return (
        <Container>
            <Title> Mais Configurações </Title>
            <>
                <TableWrapper>
                <Table>
                    <Thead>
                    <Tr>
                        <Th>Status</Th>
                        <Th>Chave</Th>
                        <Th>Ações</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        <Tr key={''}>
                        <Td>{}</Td>
                        <Td>{}</Td>
                        <Td>
                            <DeleteIcon
                            size={24}
                            onClick={() => {
                                callSecurityButton('deleteDevice')
                            }}
                            />
                        </Td>
                        </Tr>
                    </Tbody>
                </Table>
                </TableWrapper>
            
                <Button style={{width: 140}}>Adicionar este dispositivo</Button>
            </>
        </Container>
    )
}