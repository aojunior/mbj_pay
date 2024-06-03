/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Separator } from "../../../styles/global";
import { Dialog, DialogContext, FilterPanel } from "../styles";

type dialogProps = {
    toggle: () => void, 
}

export function DialogTransf({ toggle}: dialogProps) {
    const [input, setInput] = useState('')
    return (
        <Dialog id="dialog"  >
            <DialogContext style={{ gap: 10 , }}>
                <Card style={{width: '100%'}}>
                    <CardHeader>
                        <CardTitle> Extrato / Transferencias </CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <FilterPanel>
                            <input type="radio" name="filter" id="now" value="now" onChange={e=> setInput(e.currentTarget.value)}/>
                            <Label htmlFor="now"> Dia Atual</Label> <br/>

                            <input type="radio" name="filter" id="7day" value="7day" onChange={e=> setInput(e.currentTarget.value)} />
                            <Label htmlFor="7day" > Últimos 7 dias</Label> <br/>

                            <input type="radio" name="filter" id="other" value="other" onChange={e=> setInput(e.currentTarget.value)}/>
                            <Label htmlFor="other"> Outro Período: </Label>

                            <br />
                            {
                               input == "other" &&
                                <div style={{gap: 15, display: 'flex', alignItems: 'center', marginTop: 5, marginBottom: 15 }}>
                                    <Label style={{fontSize: 12}}> Data Inicial: </Label>
                                    <input type="date" />
                                    <Label style={{fontSize: 12}}> Data Final: </Label>
                                    <input type="date" />
                                </div>
                            }
                            <button>Buscar</button>
                        </FilterPanel>
                    </CardContent>
                </Card>

                <Card style={{width: '100%', height: '100%'}}>
                    <CardContent style={{overflowY: 'scroll'}}>

                    </CardContent>
                </Card>
                <Button onClick={toggle}> Fechar </Button>
            </DialogContext>
        </Dialog>
    )
}