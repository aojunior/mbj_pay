import { Button } from "@renderer/styles/global";
import { DeleteIcon, Section, Table, Tbody, Td, Th, Thead, Tr } from "../styles";
import { useState } from "react";
import { Loading } from "@renderer/components/loading";

type aliasProps = {
    aliasData: any
}

const win: any = window

export function ManageAlias({aliasData}: aliasProps) {
    const [load, setLoad] = useState(false) 

    const handleVerifyAccount = async () => {
        setLoad(true)
        await win.api.verifyAccount()
        setLoad(false)
    }

    return (
        <>
            <h1> Chave Pix </h1>
            { aliasData == 'VerifyAccount' ?
                <Button onClick={handleVerifyAccount}>
                    Verify Account
                </Button> 
            :
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
            }
            {
                load &&
                <Loading />
            }
        </>
    )
}