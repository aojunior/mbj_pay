import { useNavigate } from 'react-router-dom'
import { styled } from "styled-components";

const Sidebar = styled.div`
    height: 100%;
    width: 250px;
    border-radius: 5px;
    padding: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    gap: 15px;
`

const SidebarLink = styled.p`
    text-decoration: none;
    color: #444;
    font-size: 14px;
    &:hover {
        color: blue;
        cursor: pointer;
    }
    &:target {
        text-decoration: underline;
    }
`

export function SidebarComponent({ onSelect }: { onSelect: (section: string) => void }) {
    const navigate = useNavigate()
    return (
        <Sidebar>
            <SidebarLink onClick={() => onSelect('AddBank')}>
                Adicionar Conta de Depósito
            </SidebarLink>

            <SidebarLink onClick={() => onSelect('MyAccount')}>
                Verificar Minha Conta
            </SidebarLink>

            <SidebarLink onClick={() => onSelect('ManageAlias')}>
                Gerenciar Chaves PIX
            </SidebarLink>

            <SidebarLink>
                Verificar Atualizacao
            </SidebarLink>

            <SidebarLink>
                Suporte
            </SidebarLink>
        </Sidebar>
    )
}