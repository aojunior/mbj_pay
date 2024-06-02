import {useState, } from 'react';
import PaymentScreen from '@renderer/page/Home/Payment';
import StandBy from '@renderer/page/Home/StandBy';

function Home () {
  const [file, setFile] = useState (null );
  
  (window as any).api.reciveFile(data => {
    setFile(data)
    console.log(data)
  });

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