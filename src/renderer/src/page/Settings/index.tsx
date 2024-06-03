import { Container } from "@renderer/styles/global";
import { SidebarComponent } from "./_components/sidebar";
import { Section } from "./styles";

export default function Settings() {


    return (
        <Container style={{flexDirection: 'row'}}>
            <SidebarComponent/>
            <Section/>
        </Container>
    )
}