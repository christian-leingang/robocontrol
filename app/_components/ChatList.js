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
    <div className="p-4 mx-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Chat</h2>
      <div className="flex flex-col-reverse overflow-y-auto">
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className={`bg-blue-100 rounded-md p-2 ${index % 2 === 0 ? 'ml-auto bg-blue-300' : 'mr-auto bg-gray-200'}`}>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
