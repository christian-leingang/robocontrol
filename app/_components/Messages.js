'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import useMqtt from '../_lib/data-service';
import HookMqtt from '../components/Hook';
import mqtt from 'mqtt';

function Messages() {
  // const [mesg, setMesg] = useState('nothing heard');

  // useEffect(() => {
  const options = {
    clientId: 'amr_robot',
    protocol: 'ws',
    port: 8000,
  };
  //   const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URI, options);

  //   client.on('connect', () => {
  //     console.log('Connected to MQTT broker');
  //     client.subscribe('amr_robot');
  //   });

  //   client.on('message', (topic, message) => {
  //     const payload = { topic, message: message.toString() };
  //     setMesg(payload);
  //     console.log(`received message: ${message} from topic: ${topic}`);
  //   });

  //   return () => {
  //     client.unsubscribe('amr_robot');
  //     client.end();
  //   };
  // }, []);

  const [client, setClient] = useState(null);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState('Connect');
  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(host, mqttOption));
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
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
      return () => {
        if (client) {
          client.end();
        }
      };
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          return;
        }
        setIsSub(true);
      });
    }
  };

  return (
    <div>
      <p>The message is: {JSON.stringify(payload)}</p>
      <p>Connection status: {connectStatus}</p>
      <button onClick={() => mqttConnect(process.env.NEXT_PUBLIC_MQTT_URI, options)}>
        Connect
      </button>
      <button onClick={() => mqttSub({ topic: 'amr_robot', qos: 0 })}>Subscribe</button>
    </div>
  );
}

// const [incommingMessages, setIncommingMessages] = useState([]);
// const addMessage = (message) => {
//   setIncommingMessages((incommingMessages) => [...incommingMessages, message]);
// };
// const clearMessages = () => {
//   setIncommingMessages(() => []);
// };

// const incommingMessageHandlers = useRef([
//   {
//     topic: process.env.NEXT_PUBLIC_MQTT_TOPIC,
//     handler: (msg) => {
//       addMessage(msg);
//     },
//   },
// ]);

// const mqttClientRef = useRef(null);
// const setMqttClient = (client) => {
//   console.log(client);

//   mqttClientRef.current = client;
// };

// useMqtt({
//   uri: process.env.NEXT_PUBLIC_MQTT_URI,
//   options: {
//     clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
//     port: 8000,
//   },
//   topicHandlers: incommingMessageHandlers.current,
//   onConnectedHandler: (client) => setMqttClient(client),
// });

// const publishMessages = (client) => {
//   if (!client) {
//     console.log('(publishMessages) Cannot publish, mqttClient: ', client);
//     return;
//   }

//   client.publish(process.env.NEXT_PUBLIC_MQTT_TOPIC, { message: 'Hello from Next.js' });
//   console.log('Published 1st message');
// };

// return (
//   <div>
//     <h2>Subscribed Topics</h2>
//     {incommingMessageHandlers.current.map((i) => (
//       <p key={Math.random()}>{i.topic}</p>
//     ))}
//     <h2>Incomming Messages:</h2>
//     {incommingMessages.map((m) => (
//       <p key={Math.random()}>{m.payload.toString()}</p>
//     ))}
//     <button onClick={() => publishMessages(mqttClientRef.current)}>Publish Test Messages</button>
//     <button onClick={() => clearMessages()}>Clear Test Messages</button>
//   </div>
// );

export default Messages;
