/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, FormInput, Label, Separator } from "../../../styles/global";
import { ContentSelect, DetailContent, Dialog, DialogContext, FilterPanel } from "../styles";

type dialogProps = {
    toggle: () => void, 
}
const win: any = window

export function DialogRefund({toggle}: dialogProps) {
    const [arrCodes, setArrCodes] = useState<any>()
    const [reasonCodes, setReasonCodes] = useState('')
    const [input, setInput] = useState('')
    const dateFilter = {start: '', end: ''}
    const [extract, setExtract] = useState<any>([])

    const formatDate = (date: string) => {
        let format = date.split('T')
        let dateRaw = format[0].split('-')
        let hoursRaw = format[1].split('-')
        let dateFormated = `${dateRaw[2]}-${dateRaw[1]}-${dateRaw[0]}`
        let hoursFormated = hoursRaw[0]
        return dateFormated +' '+ hoursFormated
    }

    function subtractDaysFromDate() {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        let d = date.toISOString();
        let dateFormat = d.split('T')
        return dateFormat[0]
    }

    async function filterExtract() {
        let date = new Date().toISOString()
        let now = date.split('T')

        if(input == 'other') {
           await win.api.extractBalanceFilter(dateFilter.start, dateFilter.end)
        }
        if(input == '7day') {
            await win.api.extractBalanceFilter(subtractDaysFromDate(), now[0] )
        }
        if(input == 'now') {
            await win.api.extractBalanceFilter(now[0], now[0])
        }
        
        await win.api.responseExtractFilter(data => {setExtract(data.statement)})
    }

    const handleKeyButton = async (event) => {
        switch(event.key || event) {
            case 'F1':
                await filterExtract()
            break;

        }
    };

    async function getRefundCodes() {
        await win.api.refundCodes()
        await win.api.responseRefundCodes(data => {
            console.log(data.returnCodes)
            setArrCodes(data.returnCodes)})
    } 

    async function handleRefund(item) {
        if(reasonCodes == '') 
            return alert('Selecione um motivo')

        await win.api.refund(item.transactionId, reasonCodes)
    }
    
    useEffect(() => {
        getRefundCodes()
        window.addEventListener('keydown', handleKeyButton);
    
        return () => {
          window.removeEventListener('keydown', handleKeyButton);
        };
    }, []);

      
    return (
        <Dialog id="dialog"  >
            <DialogContext style={{ gap: 10 , }}>
                <Card style={{width: '100%'}}>
                    <CardHeader>
                        <CardTitle> Devolucao Pagamento </CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <FilterPanel>
                            <FormInput>
                                <Label>Selecione o Motivo:</Label>
                                <select onChange={e => setReasonCodes(e.currentTarget.value)}>
                                    <option value="">- SELECT -</option>
                                    {
                                        arrCodes && arrCodes.map(data => 
                                            <option value={data.code} >{data.description}</option>
                                        )
                                    }
                                </select>
                            </FormInput>
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
                                    <input type="date" onChange={e => dateFilter.start = e.currentTarget.value}/>
                                    <Label style={{fontSize: 12}}> Data Final: </Label>
                                    <input type="date" onChange={e => dateFilter.end = e.currentTarget.value}/>
                                </div>
                            }
                            <Button onClick={() => handleKeyButton('F1')} >Buscar</Button>
                        </FilterPanel>
                    </CardContent>
                </Card>

                <Card style={{width: '100%', height: '100%'}}>
                    <CardContent style={{overflowY: 'scroll', height: '100%', justifyContent: 'flex-start'}}>
                        {  
                            extract.map((item, index) => {
                                return (
                                    item.type == 'C' &&
                                    <ContentSelect onClick={() => handleRefund(item)}>
                                        <Label style={{fontSize: 16}}>{formatDate(item.entryDate)}</Label> <br />
                                        <Label style={{fontSize: 16}}>{item.description}</Label><br />
                                        <DetailContent style={{ color: 'green'}}>
                                            <p style={{fontWeight: '700', fontSize: 18}}>R$ {item.amount.toFixed(2)}</p>
                                        </DetailContent>
                                    </ContentSelect>
                                )
                            })
                        }
                    </CardContent>
                </Card>
                <Button onClick={toggle}> Fechar </Button>
            </DialogContext>
        </Dialog>
    )
}