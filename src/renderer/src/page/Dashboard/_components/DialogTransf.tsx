import { Button, Card, CardContent, CardHeader, CardTitle, Label, Separator } from "../../../styles/global";
import { Dialog, FilterPanel } from "../styles";

export function DialogTransf() {

    return (
        <Dialog open>
            <Card style={{width: '100%'}}>
                <CardHeader>
                    <CardTitle> Extrato / Transferencias </CardTitle>
                    <Separator/>
                </CardHeader>
                <CardContent>
                    <FilterPanel>
                        <input type="radio" id="now" value="now" checked />
                        <Label htmlFor="now"> Dia Atual</Label> <br/>

                        <input type="radio" id="7day" value="7day" />
                        <Label> Ultimos 7 dias</Label> <br/>

                        <input type="radio" />
                        <Label> Outro Periodo: </Label>
                        <>
                            <Label> Data Inicial: </Label>
                            <input type="date" />
                            <Label> Data Final: </Label>
                            <input type="date" />

                        </>
                    </FilterPanel>
                </CardContent>

                <Button > Fechar </Button>
            </Card>
    </Dialog>
    )
}