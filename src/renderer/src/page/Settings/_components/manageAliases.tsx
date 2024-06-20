import { Button } from "@renderer/styles/global";
import { DeleteIcon, Section, Table, Tbody, Td, Th, Thead, Tr } from "../styles";
import { useEffect, useState } from "react";
import { Loading } from "@renderer/components/loading";

type aliasProps = {
    Data: any
}

const win: any = window

export function ManageAlias({Data}: aliasProps) {
    const [aliasData, setAliasData] = useState(Data)
    const [isLoad, setIsLoad] = useState(false) 

    const handleCreateAccount = async () => {
        setIsLoad(true)
        let create = await win.api.createAlias()
        setIsLoad(false)
        return create
    }

    const handleDeleteAlias = async (alias) => {
        setIsLoad(true)
        const del = await win.api.deleteAlias(alias)
        let resp = await win.api.verifyAlias()
        setAliasData(resp)
        setIsLoad(false)
        return del
    }

    const handleKeyButton = async (event) => {
        switch(event.key || event) {
          case 'F5':
            setIsLoad(true)
            await win.api.updateAlias()
            let resp = await win.api.verifyAlias()
            setAliasData(resp) 
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
        <>
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

                <Button onClick={handleCreateAccount}>
                    Add Chave
                </Button>
                </>   
            

        </>
    )
}