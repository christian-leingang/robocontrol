import { useState, useEffect } from 'react';

const ChatList = ({ client }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (client) {
      client.on('message', (topic, message) => {
        setMessages((prevMessages) => [...prevMessages, message.toString()]);
      });
    }
  }, [client]);

  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
