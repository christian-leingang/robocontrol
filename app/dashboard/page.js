'use client';

import { useEffect, useState } from 'react';
import ChatList from '../_components/ChatList';
import PublishButtons from '../_components/Commands';
import Config from '../_components/Config';
import { useMqttClient } from '../_lib/useMqttClient';

function Dashboard() {
  const [config, setConfig] = useState({});
  const [reloadConfig, setReloadConfig] = useState({});
  const { client, connectStatus } = useMqttClient(config);

  useEffect(() => {
    if (connectStatus === 'Connected') {
      const message = { msg: 'dashboard_ready', sender_id: 99 };
      client.publish(config.topic, JSON.stringify(message));
    }
  }, [connectStatus, client, config.topic]);

  const handleConfigChange = (newConfig) => {
    if (
      newConfig.url === config.url &&
      newConfig.port === config.port &&
      newConfig.username === config.username &&
      newConfig.password === config.password &&
      newConfig.topic === config.topic
    )
      return;

    setConfig(newConfig);
  };

  return (
    <div className='grid flex-1 px-8 py-4'>
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
            <ChatList
              client={client}
              configTopic={config.topic}
              connectStatus={connectStatus}
              setReloadConfig={setReloadConfig}
            />
          </div>
          <div className='w-1/2'>
            <PublishButtons client={client} topic={config.topic} reloadConfig={reloadConfig} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
