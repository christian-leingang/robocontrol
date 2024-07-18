import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export function useMqttClient(config) {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState('Connect');

  useEffect(() => {
    if (!config.url) return;
    console.log(config);

    const newClient = mqtt.connect(`${config.url}:${config.port}/${config.path ?? ''}`, {
      username: config.username,
      password: config.password,
    });
    console.log(newClient);

    console.log('Hier', `${config.url}:${config.port}/${config.path ?? ''}`);

    newClient.on('connect', () => {
      newClient.subscribe(config.topic);
      setConnectStatus('Connected');
    });
    newClient.on('error', (err) => {
      console.error('Connection error: ', err);
      newClient.end();
      setConnectStatus('Disconnected');
    });
    newClient.on('reconnect', () => {
      setConnectStatus('Reconnecting');
    });

    setClient(newClient);

    return () => newClient.end();
  }, [config]);

  return { client, connectStatus };
}
