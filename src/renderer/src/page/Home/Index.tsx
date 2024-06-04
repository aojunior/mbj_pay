import {useEffect, useState, } from 'react';
import PaymentScreen from '@renderer/page/Home/Payment';
import StandBy from '@renderer/page/Home/StandBy';

const win: any = window

function Home () {
  const [file, setFile] = useState (null);
  

  useEffect(() => {
    win.api.reciveFile( data => {
      setFile(data.data)
    })
  },[])

  return(
    file === null ?
    <StandBy/>
      :
    <PaymentScreen file={file} />
    // {/* <button onClick={sendMessage}> Send </button>
    // <button onClick={render}> Teste </button> */}
  );
};

export default Home;