'use client';
import { IconPlugConnected } from '@tabler/icons-react';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const Config = ({ onConfigChange, connectionStatus }) => {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_MQTT_URI);
  const [port, setPort] = useState(process.env.NEXT_PUBLIC_MQTT_PORT);
  const [path, setPath] = useState(process.env.NEXT_PUBLIC_MQTT_PATH);
  const [topic, setTopic] = useState(process.env.NEXT_PUBLIC_MQTT_TOPIC);

  const handleSubmit = (e) => {
    console.log('url: ', url);
    e.preventDefault();

    onConfigChange({ url, port, path, topic });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex justify-between rounded-md border p-4'>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <IconPlugConnected
                stroke={2}
                color={`${connectionStatus == 'Connected' ? 'green' : 'red'}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div>{connectionStatus}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='flex'>
          <div className='grid max-w-sm items-center gap-1.5'>
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
        </div>
        <Button type='submit'>Configure</Button>
      </div>
    </form>
  );
};

export default Config;
