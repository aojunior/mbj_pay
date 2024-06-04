import { useEffect, useState } from "react";
import { FormTransf } from "./_components/formTransf";
import { Button } from "@renderer/styles/global";

const win: any = window

export default function Dashboard() {
  const [balance, setBalance] = useState({})
  const [extract, setExtract] = useState<any>([])

  async function loadBalance() {
    setBalance({})
    await win.api.verifyBalance()
    await win.api.responseBalance( data => {
      setBalance(data)
    })

    await win.api.extractBalanceToday()
    await win.api.responseExtractToday( data => {
      setExtract(data.statement as any[])
    })
  }

  const handleKeyButton = async (event) => {
    switch(event.key || event) {
      case 'F5':
        loadBalance()
      break;
    }
  };

  useEffect(() => {
    loadBalance()
    window.addEventListener('keydown', handleKeyButton);

    return () => {
      window.removeEventListener('keydown', handleKeyButton);
    };
  }, []);

  return (
    <>
      <Button style={{position: 'absolute', right:10, top: 80}} onClick={() => handleKeyButton('F5')} ><code>F5</code> - Atualizar</Button>
      <FormTransf balance={balance} extract={extract}/>
    </>
  )
}