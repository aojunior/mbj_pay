import React, {useState, useEffect} from 'react';
import PaymentScreen from '@renderer/components/PaymentScreen';
import StandBy from '@renderer/components/StandBy';
import { ipcRenderer } from 'electron';
const Home: React.FC = () => {
  const [file, setFile] = useState<{}> ({})

  async function render () {
    // const a = window.electronAPI.render()

    // ipcRenderer.on('file-content', (_, data) => {
    //   console.log(data);
    // });
    
  }

  useEffect(() => {
    ipcRenderer.on('file-content', (event, data) => {
      console.log(data)
    })
    return () =>{ ipcRenderer.removeAllListeners('file-content')}
  }, []);

  return(
    <>
      <StandBy/>
      {/* <pre>{file.orderValue}</pre> */}
      <button onClick={render}> Teste </button>
    </>
  )
}

export default Home;