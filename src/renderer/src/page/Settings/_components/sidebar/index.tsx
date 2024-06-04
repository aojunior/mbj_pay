import { Sidebar, SidebarContent, SidebarLink } from "./styles";


export function SidebarComponent() {

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarLink>
                    Adicionar Conta de Depósito
                </SidebarLink>

                <SidebarLink>
                    Verificar Atualizacao
                </SidebarLink>

                <SidebarLink>
                    Suporte
                </SidebarLink>

            </SidebarContent>
        </Sidebar>
    )
}