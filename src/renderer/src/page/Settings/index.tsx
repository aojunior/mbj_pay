import { Container } from '@renderer/styles/global'
import { SidebarComponent } from './_components/Sidebar'
import { useState } from 'react'
import { AddFavoriteRecipient } from './_components/AddFavoriteRecipient'
import { ManageAlias } from './_components/manageAliases'
import { MyAccount } from './_components/myAccount'
import { Section } from './_components/Section'
import { CheckUpdates } from './_components/updateSystem'
import { Support } from './_components/support'

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState('')

  const renderContent = (): any => {
    switch (selectedSection) {
      case 'AddBank':
        return <AddFavoriteRecipient />
      case 'MyAccount':
        return <MyAccount />
      case 'ManageAlias':
        return <ManageAlias />
      case 'CheckUpdates':
        return <CheckUpdates />
        case 'Support':
          return <Support />
    }
  }

  return (
    <Container style={{ flexDirection: 'row', overflowY: 'hidden'}}>
      <SidebarComponent onSelect={setSelectedSection} select={selectedSection} />
      <Section>{renderContent()}</Section>
    </Container>
  )
}
