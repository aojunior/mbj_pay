import { Container } from '@renderer/styles/global'
import { SidebarComponent } from './_components/Sidebar'
import { useState } from 'react'
import { AddBank } from './_components/AddBank'
import { ManageAlias } from './_components/manageAliases'
import {} from './styles'
import { MyAccount } from './_components/myAccount'
import { Section } from './_components/Section'

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState('')

  const renderContent = (): any => {
    switch (selectedSection) {
      case 'AddBank':
        return <AddBank />
      case 'MyAccount':
        return <MyAccount />
      case 'ManageAlias':
        return <ManageAlias />
    }
  }

  return (
    <Container style={{ flexDirection: 'row' }}>
      <SidebarComponent onSelect={setSelectedSection} select={selectedSection} />
      <Section>{renderContent()}</Section>
    </Container>
  )
}
