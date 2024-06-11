import { Button } from "@renderer/styles/global";
import { DeleteIcon, Section, Table, Tbody, Td, Th, Thead, Tr } from "../styles";

type aliasProps = {
    aliasData: any
}

export function ManageAlias({aliasData}: aliasProps) {
    
    return (
        <>
            <h1> Gerenciar Chaves</h1>
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
                        <Td>{data.status}</Td>
                        <Td>{data.name}</Td>
                        <Td>
                            <DeleteIcon size={24} />
                        </Td>
                    </Tr>
                   )}
                </Tbody>
            </Table>
            <span style={{color: '#999', textAlign: 'end'}}>{aliasData.length}/5</span>

            <Button>
                Add Chave
            </Button>
        </>

    )
}