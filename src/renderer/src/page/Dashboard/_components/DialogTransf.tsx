/* eslint-disable prettier/prettier */
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Separator } from "../../../styles/global";
import { Dialog, FilterPanel } from "../styles";

type dialogProps = {
    toggle: () => void, 
}

export function DialogTransf({ toggle}: dialogProps) {
    return (
        <Dialog id="dialog" style={{ gap: 10 }}>
            <Card style={{width: '100%'}}>
                <CardHeader>
                    <CardTitle> Extrato / Transferencias </CardTitle>
                    <Separator/>
                </CardHeader>
                <CardContent>
                    <FilterPanel>

                        <input type="radio" name="filter" id="now" value="now" checked />
                        <Label htmlFor="now"> Dia Atual</Label> <br/>

                        <input type="radio" name="filter" id="7day" value="7day" />
                        <Label> Ultimos 7 dias</Label> <br/>

                        <div style={{gap: 15, display: 'flex', alignItems: 'center'}}>
                            <>
                                <input type="radio" name="filter" id="other" value="other"/>
                                <Label> Outro Periodo: </Label>
                            </>
                            <>
                                <Label style={{fontSize: 12}}> Data Inicial: </Label>
                                <input type="date" />
                                <Label style={{fontSize: 12}}> Data Final: </Label>
                                <input type="date" />
                            </>
                            
                            <button>Buscar</button>

                        </div>
                    </FilterPanel>
                </CardContent>
            </Card>

            <Card style={{width: '100%', height: '100%'}}>
                <CardContent style={{overflowY: 'scroll'}}>

                </CardContent>
            </Card>
            <Button onClick={toggle}> Fechar </Button>
        </Dialog>
    )
}