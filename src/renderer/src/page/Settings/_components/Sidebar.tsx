import { styled } from 'styled-components'

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
const SidebarLink = styled.button<{ selected: any }>`
  color: #444;
  padding: 5px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
  background-color: #f5f5f7;
  border: none;
  ${({ selected }) =>
    selected &&
    `
    color: blue;
    background-color: #e5e5e7;
  `}
  &:hover {
    color: blue;
    background-color: #e5e5e7;
    cursor: pointer;
  }
  &:target {
    text-decoration: underline;
  }
`
type selectNavProps = {
  select: string
  onSelect: (section: string) => void
}

export function SidebarComponent({ onSelect, select }: selectNavProps) {
  const navList = [
    {
      name: 'AddBank',
      text: 'Adicionar Conta de Depósito'
    },
    {
      name: 'MyAccount',
      text: 'Verificar Minha Conta'
    },
    {
      name: 'ManageAlias',
      text: 'Gerenciar Chaves PIX'
    },
    {
      name: 'CheckVersion',
      text: 'Verificar Atualizacao'
    },
    {
      name: 'Support',
      text: 'Suporte'
    }
  ]

  return (
    <Sidebar>
      {navList.map((list) => (
        <SidebarLink
          key={list.name}
          selected={list.name === select}
          onClick={() => onSelect(list.name)}
        >
          {list.text}
        </SidebarLink>
      ))}
    </Sidebar>
  )
}
