'use client';

import { useState } from 'react';
import Config from './_components/Config';
import ChatList from './_components/ChatList';
import PublishButtons from './_components/Commands';
import Header from './_components/Header';
import { useMqttClient } from './_lib/useMqttClient';

function Home() {
  const [config, setConfig] = useState({});
  const { client, connectStatus } = useMqttClient(config);

  const handleConfigChange = (newConfig) => {
    if (
      newConfig.url === config.url &&
      newConfig.port === config.port &&
      newConfig.path === config.path &&
      newConfig.topic === config.topic
    )
      return;

    setConfig(newConfig);
  };

  return (
    <div>
      <Header />
      <div className='grid flex-1 p-8'>
        <main className='mx-auto w-full max-w-7xl'>
          <Config onConfigChange={handleConfigChange} connectionStatus={connectStatus} />
          {connectStatus === 'Connected' ? (
            ''
          ) : (
            <h2 className='absolute left-0 right-0 top-96 z-10 mt-4 text-center text-2xl font-bold'>
              Can&apos;t show messages, please connect to the broker.
            </h2>
          )}

          <div
            className={`mt-4 flex w-full gap-4 ${connectStatus === 'Connected' ? '' : 'pointer-events-none blur-2xl'} `}
          >
            <div className='w-1/2'>
              <ChatList client={client} />
            </div>
            <div className='w-1/2'>
              <PublishButtons client={client} topic={config.topic} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
