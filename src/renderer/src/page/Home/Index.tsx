import React, {useState, useEffect, useMemo,} from 'react';
import PaymentScreen from '@renderer/page/Home/_components/PaymentScreen';
import StandBy from '@renderer/page/Home/_components/StandBy';
import { fileProps } from '@shared/constants';

const Home: React.FC = () => {
  const [msg, setMesg] = useState<string> ('');
  const [count, setCount] = useState<number> (0);
  const [file, setFile] = useState (null);

  async function render () {
    console.log(window.api)
  };

  async function sendMessage () {
    const obj = {
      msg: msg,
      count: 0,
    }
    const a = window.api.sendMsg(obj);
    setMesg('');
    // window.api.onCount(data => setCount(data))
  };
  
  window.api.reciveFile(data => {
    setFile(data)
    console.log(data)
  });

  return(
    <div >
      {
        file === null ?
        <div style={{position: 'absolute', top: '50%', left: '30%'}}>
          <StandBy />
        </div>
        :
        <PaymentScreen file={file} />
      }
      {/* <button onClick={sendMessage}> Send </button>
      <button onClick={render}> Teste </button> */}
    </div>
  );
};

export default Home;