import { Container } from "@renderer/styles/global";
import { SidebarComponent } from "./_components/Sidebar";
import { useEffect, useState } from "react";
import { AddBank } from "./_components/AddBank";
import { ManageAlias } from "./_components/manageAliases";
import { Section } from "./styles";

const win: any = window
export default function Settings() {
    const [selectedSection, setSelectedSection] = useState('AddBank');
    const [responseAliases, setResponseAliases] = useState<any>()

    async function verifyAlias() {
      await win.api.verifyAlias()
      await win.api.responseVerifyAlias(data =>  {
        console.log(data)
        setResponseAliases(data)
      })
    }

    const renderContent = () => {
      switch (selectedSection) {
        case 'AddBank':
          return <AddBank />;
        case 'ManageAlias':          
          return <ManageAlias aliasData={responseAliases} />;
      }
    };

    useEffect(() => {
      verifyAlias()
    }, [])

    return (
      <Container style={{flexDirection: 'row'}}>
        <SidebarComponent onSelect={setSelectedSection}/>
        <Section>
          {renderContent()}
        </Section>

      </Container>
    )
}