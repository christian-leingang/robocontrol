'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconEye, IconEyeOff, IconPlugConnected } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import CustomTooltip from './CustomTooltip';

// Nachrichten zum Testen:
// {"sender_id": 1, "data": null, "receivers": [1], "msg": "ready"}
// {"sender_id": 1, "data": null, "receivers": null, "msg": "robot_start"}

const Config = ({ onConfigChange, connectionStatus }) => {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_MQTT_URI);
  const [port, setPort] = useState(process.env.NEXT_PUBLIC_MQTT_PORT);
  const [path, setPath] = useState(process.env.NEXT_PUBLIC_MQTT_PATH);
  const [topic, setTopic] = useState(process.env.NEXT_PUBLIC_MQTT_TOPIC);
  const [username, setUsername] = useState(process.env.NEXT_PUBLIC_MQTT_USERNAME);
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_MQTT_PASSWORD);
  const [passwordVisible, setPasswordVisibility] = useState(true);
  const [passwordType, setPasswordType] = useState('password');

  const handleInitialSubmit = () => {
    if (!url || !port || !username || !password || !topic) {
      console.log('Please fill all the fields');
      return;
    }
    onConfigChange({ url, port, path, topic, username, password });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleInitialSubmit();
  };

  const handleToggle = () => {
    setPasswordVisibility(!passwordVisible);
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };

  //Comment out if Client is constantly refreshing
  useEffect(() => {
    handleInitialSubmit();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className='m-auto flex justify-between rounded-md border border-gray-200 bg-white p-4 shadow-md dark:border-gray-800 dark:bg-slate-800'>
        <div className='flex items-end pb-2'>
          <CustomTooltip tooltipText={`Connection Status: ${connectionStatus}`}>
            <IconPlugConnected
              stroke={2}
              color={`${connectionStatus == 'Connected' ? 'green' : 'red'}`}
            />
          </CustomTooltip>
        </div>
        <div className='ml-6 flex flex-1 items-end gap-4'>
          <div className='grid w-1/4 max-w-sm items-center gap-1.5'>
            <Label htmlFor='url'>URL</Label>
            <Input type='text' id='url' value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className='grid max-w-sm items-center gap-1.5'>
            <Label htmlFor='port'>Port</Label>
            <Input type='text' id='port' value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
          <div className='grid max-w-sm items-center gap-1.5'>
            <Label htmlFor='path'>Path</Label>
            <Input type='text' id='path' value={path} onChange={(e) => setPath(e.target.value)} />
          </div>

          <div className='grid max-w-sm items-center gap-1.5'>
            <Label htmlFor='topic'>Topic</Label>
            <Input
              type='text'
              id='topic'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className='grid max-w-sm items-center gap-1.5'>
            <Label htmlFor='username'>Username</Label>
            <Input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className='grid max-w-sm items-center gap-1.5'>
            <Label htmlFor='topic'>Password</Label>
            <div className='flex'>
              <Input
                type={passwordType}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pr-9'
              />
              <span
                className='flex cursor-pointer items-center justify-around'
                onClick={handleToggle}
              >
                {passwordVisible ? (
                  <IconEye className='absolute mr-10' size={20} />
                ) : (
                  <IconEyeOff className='absolute mr-10' size={20} />
                )}
              </span>
            </div>
          </div>
          <Button type='submit'>Configure</Button>
        </div>
      </div>
    </form>
  );
};

export default Config;
