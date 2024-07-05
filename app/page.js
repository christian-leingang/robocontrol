'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import Config from './_components/Config';
import ChatList from './_components/ChatList';
import PublishButtons from './_components/Commands';
import Header from './_components/Header';

function Home() {
  const [client, setClient] = useState(null);
  const [config, setConfig] = useState({});
  const [connectStatus, setConnectStatus] = useState('Connect');
  const [ownMessages, setOwnMessages] = useState([]);


  const handleConfigChange = ({ url, port, path, topic }) => {
    console.log('path: ', path);

    const newClient = mqtt.connect(`${url}:${port}/${path}`);
    newClient.on('connect', () => {
      newClient.subscribe(topic);
    });
    console.log('newClient: ', newClient);

    setClient(newClient);
    setConfig({ url, port, path, topic });
  };

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
    }
  }, [client]);

  return (
    <div>
      <Header />
      <div className='grid flex-1 p-8'>
        <main className='mx-auto w-full max-w-7xl'>
          <Config onConfigChange={handleConfigChange} connectionStatus={connectStatus} />
          {client && client.connected ? (""): (
                        <h2 className='text-center mt-4'>Can't show messages, please connect to the broker.</h2>
          )}
            
          <div className={`flex h-full w-full mt-4 gap-4 ${client && client.connected ? "": "blur-md"} `}>
            <div className='w-1/2'>
              <ChatList client={client} />
            </div>
            <div className='w-1/2'>
              <PublishButtons client={client} topic={config.topic} setOwnMessages={setOwnMessages} />
            </div>
          </div>
          {/* ) : (
          )
          } */}
        </main>
      </div>
    </div>
  );
}

export default Home;
