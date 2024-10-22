import { Button, Container } from "@renderer/styles/global"
import { useState } from "react"
import { useEffect } from "react";
import { Title } from "../styles";
import { useLoading } from "@renderer/context/loading.context";

const win: any = window
export function CheckUpdates() {
    const { setIsLoading } = useLoading()
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [updateDownloaded, setUpdateDownloaded] = useState(false);
  
    const version = '0.8.5'


    useEffect(() => {
        win.api.onUpdateAvailable(() => {
          setUpdateAvailable(true);
        });
    
        win.api.onUpdateDownloaded(() => {
          setUpdateDownloaded(true);
        });
    
        return () => {
          // Limpar os ouvintes, se necessário
        };
    }, []);
    
    const handleUpdate = () => {
        setIsLoading(true)
        win.api.downloadUpdate();
        setIsLoading(false)
    };

    const handleRestart = () => {
        win.api.sendRestartApp();
    };

    return (
        <Container style={{overflowY: 'auto'}} >
            <Title> Verificar se há atualização </Title>
            <div style={{ marginTop: 120, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 30}}>
                {
                    !updateAvailable &&
                    <p>Você está com a versão mais recente!</p>
                }
                {
                    updateAvailable && !updateDownloaded && 
                    <>
                        <p>Há uma nova atualização disponível!</p>
                        <Button style={{ marginTop: 15 }} onClick={handleUpdate}> Baixar Atualização </Button>
                    </> 
                }
                {updateDownloaded && (
                    <Button onClick={handleRestart}>Reiniciar aplicação</Button>
                )}
                
                <p>Versão atual: {version}</p>
            </div>
      </Container>
    )
}