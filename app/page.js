'use client';

import { useEffect, useState } from 'react';
import Config from './_components/Config';
import ChatList from './_components/ChatList';
import PublishButtons from './_components/Commands';
import Header from './_components/Header';
import { useMqttClient } from './_lib/useMqttClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function Home() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [config, setConfig] = useState({});
  const { client, connectStatus } = useMqttClient(config);
  const [pingPong, setPingPong] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(isAuth === 'for_amr_secret');
  }, []);

  useEffect(() => {
    if (connectStatus === 'Connected') {
      const message = { msg: 'dashboard_ready', sender_id: 99 };
      client.publish(config.topic, JSON.stringify(message));
    }
  }, [connectStatus, client, config.topic]);

  useEffect(() => {
    if (!pingPong) return;

    const intervalId = setInterval(() => {
      if (connectStatus === 'Connected') {
        const message = { msg: 'ping', sender_id: 99 };
        client.publish(config.topic, JSON.stringify(message));
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [client, connectStatus, config.topic, pingPong]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === 'amr_top_Secret_P@ssword_1234_') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'for_amr_secret');
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Header />
        <div className='flex flex-grow items-center justify-center overflow-hidden bg-gray-100 dark:bg-slate-950'>
          <div className='w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-700'>
            <form onSubmit={handleSubmit} className=''>
              <div>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <Button type='submit' className='mt-4 w-full font-bold'>
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
      <div className='grid flex-1 p-8 pt-4'>
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
              <ChatList client={client} pingPong={pingPong} setPingPong={setPingPong} />
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
