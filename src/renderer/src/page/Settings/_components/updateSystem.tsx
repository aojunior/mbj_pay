import { Loading } from "@renderer/components/loading"
import { Button } from "@renderer/styles/global"
import { useState } from "react"
import { useEffect } from "react";

const win: any = window
export function CheckUpdates() {
    const [isLoad, setLoad] = useState(false)
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [updateDownloaded, setUpdateDownloaded] = useState(false);
  
    const version = '0.8.5'

    // const check = async () => {
    //     setLoad(true)
    //     await win.api.checkUpdates()
    //     setLoad(false)
    //     if(await win.api.updateAvailable()) {
    //         setUpdateAvailable(true)
    //         return
    //     }
    //     if(await win.api.updateNotAvailable()) {
    //         setUpdateAvailable(false)
    //         return
    //     }
    //     if(await win.api.updateError()) {
    //         setUpdateAvailable(false)
    //         return
    //     }
    // }

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
        // Inicia o download da atualização
        win.api.downloadUpdate();
      };
    
      const handleRestart = () => {
        win.api.sendRestartApp();
      };

    return (
        <div
            style={{
            paddingLeft: 40,
            paddingRight: 40,
            gap: 15
            }}
        >
            {isLoad && <Loading />}
            <h1> Verificar se há atualização </h1>
            <div style={{ marginTop: 120, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 30}}>
                {
                    !updateAvailable &&
                    <p>Você está com a versão mais atual!</p>
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
      </div>
    )
}