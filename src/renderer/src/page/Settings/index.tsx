import { Container } from "@renderer/styles/global";
import { SidebarComponent } from "./_components/Sidebar";
import { useState } from "react";
import { AddBank } from "./_components/AddBank";
import { CreateAlias } from "./_components/CreateAlias";

export default function Settings() {
    const [selectedSection, setSelectedSection] = useState('AddBank');

    const renderContent = () => {
      switch (selectedSection) {
        case 'AddBank':
          return <AddBank />;
        case 'CreateAlias':
          return <CreateAlias />;
      }
    };

    return (

        <Container style={{flexDirection: 'row'}}>
            <SidebarComponent onSelect={setSelectedSection}/>

            {renderContent()}

        </Container>
    )
}