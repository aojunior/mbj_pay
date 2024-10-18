import { Button } from "@renderer/styles/global"
import { Title } from "../styles";

const win: any = window
export function Support() {

    return (
        <div
            style={{
                paddingLeft: 40,
                paddingRight: 40,
                gap: 15,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Title> Suporte Técnico </Title>

            <span>
                Para ajuste e melhorias, entre em contato conosco:
            </span>

            <Button
                style={{ alignSelf: 'center', marginTop: 80, width: 120}}
                onClick={() => win.open('https://www.mbjinformatica.com.br/contato/', '_blank')}
            >
                Acessar Suporte
            </Button>
        </div>
    )
}