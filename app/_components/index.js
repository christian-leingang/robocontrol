// pages/index.js
import { useState } from 'react';
import mqtt from 'mqtt';
import Config from '../components/Config';
import ChatList from '../components/ChatList';
import PublishButtons from '../components/PublishButtons';

function Home() {
  const [client, setClient] = useState(null);
  const [config, setConfig] = useState({});

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

  //OLD CODE

  return (
    <div>
      <Config onConfigChange={handleConfigChange} />
      <div className='flex mt-6'>
        <ChatList client={client} />
        <PublishButtons client={client} topic={config.topic} setOwnMessages={setOwnMessages} />
      </div>
    </div>
  );
}

export default Home;
