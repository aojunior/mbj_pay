import { Loading } from "@renderer/components/loading"
import { Button } from "@renderer/styles/global"
import { useState } from "react"

const win: any = window
export function CheckUpdates() {
    const [isLoad, setLoad] = useState(false)
    const [available, setAvailable] = useState(false)

    const version = '0.8.5'

    const check = async () => {
        setLoad(true)
        await win.api.checkUpdates()
        setLoad(false)
        if(await win.api.updateAvailable()) {
            setAvailable(true)
            return
        }
        if(await win.api.updateNotAvailable()) {
            setAvailable(false)
            return
        }
        if(await win.api.updateError()) {
            setAvailable(false)
            return
        }
    }

    return (
        <div
            style={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 40,
            paddingRight: 40,
            gap: 15
            }}
        >
            {isLoad && <Loading />}
            <h1> Verificar se há atualização </h1>
            {
                available ?
                <div>
                    <p>Há uma nova atualização disponível!</p>
                    <Button style={{ marginTop: 15 }} onClick={() => win.api.downloadUpdate()}> Baixar Atualização </Button>
                </div> 
                :
                <Button style={{}} onClick={check}> Verificar </Button>
            }
            <span>Versão atual: {version}</span>
      </div>
    )
}