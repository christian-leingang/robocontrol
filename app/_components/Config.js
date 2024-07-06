'use client';

import { IconPlugConnected } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const Config = ({ onConfigChange, connectionStatus }) => {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_MQTT_URI);
  const [port, setPort] = useState(process.env.NEXT_PUBLIC_MQTT_PORT);
  const [path, setPath] = useState(process.env.NEXT_PUBLIC_MQTT_PATH);
  const [topic, setTopic] = useState(process.env.NEXT_PUBLIC_MQTT_TOPIC);

  const handleInitialSubmit = () => {
    if (!url || !port || !path || !topic) {
      console.log('Please fill all the fields');

      return;
    }
    onConfigChange({ url, port, path, topic });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleInitialSubmit();
  };

  //Comment out if Client is constantly refreshing
  useEffect(() => {
    handleInitialSubmit();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className='m-auto flex justify-between rounded-md border border-gray-200 p-4 shadow-md dark:border-gray-700'>
        <div className='flex items-end pb-2'>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <IconPlugConnected
                  stroke={2}
                  color={`${connectionStatus == 'Connected' ? 'green' : 'red'}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div>Status: {connectionStatus}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className='ml-6 flex flex-1 items-end gap-4'>
          <div className='grid w-1/4 max-w-sm items-center gap-1.5'>
            <Label htmlFor='url'>URL</Label>
            <Input type='text' id='url' value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className='grid w-1/4 max-w-sm items-center gap-1.5'>
            <Label htmlFor='port'>Port</Label>
            <Input type='text' id='port' value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
          <div className='grid w-1/4 max-w-sm items-center gap-1.5'>
            <Label htmlFor='path'>Path</Label>
            <Input type='text' id='path' value={path} onChange={(e) => setPath(e.target.value)} />
          </div>
          <div className='grid w-1/4 max-w-sm items-center gap-1.5'>
            <Label htmlFor='topic'>Topic</Label>
            <Input
              type='text'
              id='topic'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button type='submit'>Configure</Button>
        </div>
      </div>
    </form>
  );
};

export default Config;
