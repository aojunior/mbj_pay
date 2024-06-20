import { Container } from "@renderer/styles/global";
import { SidebarComponent } from "./_components/Sidebar";
import { useEffect, useState } from "react";
import { AddBank } from "./_components/AddBank";
import { ManageAlias } from "./_components/manageAliases";
import { Section } from "./styles";
import { MyAccount } from "./_components/myAccount";

const win: any = window
export default function Settings() {
    const [selectedSection, setSelectedSection] = useState('AddBank');
    const [responseAliases, setResponseAliases] = useState<any>()
    const [account, setAccount] = useState <any>()

    async function verifyAlias() {
      let resp = await win.api.verifyAlias()
      setResponseAliases(resp)
    }

    async function getAccount() {
      const data = await win.api.getAccount()
      setAccount(data)
    }

    const renderContent = () => {
      switch (selectedSection) {
        case 'AddBank':
          return <AddBank />;
        case 'ManageAlias':          
          return <ManageAlias Data={responseAliases} />;
        case 'MyAccount':          
          return <MyAccount acc={account}/>;
      }
    };

    useEffect(() => {
      getAccount()
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