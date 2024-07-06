import { useState, useEffect, useRef } from 'react';

const ChatList = ({ client }) => {
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (client && !client.connected) {
      setMessages([]);
    }
    if (client) {
      client.on('message', (topic, message) => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message.toString());
          parsedMessage.timestamp = timestamp;
        } catch (error) {
          parsedMessage = { msg: message.toString(), sender_id: 'unknown', timestamp };
        }
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      });
    }
  }, [client]);

  return (
    <div className='mx-auto h-[70vh] rounded-lg border border-gray-200 shadow-md dark:border-gray-700'>
      <h2 className='ml-4 mt-4 text-2xl font-semibold'>Chat</h2>
      <div className='flex h-[calc(70vh-3rem)] flex-col-reverse overflow-auto'>
        {messages.length === 0 && (
          <div className='my-auto flex h-full items-center justify-center text-sm'>
            No messages yet
          </div>
        )}
        <ul className='mx-2 space-y-2'>
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`w-3/4 rounded-b-lg p-2 ${msg.sender_id === 'webapp' ? 'ml-auto rounded-tl-lg bg-blue-500 text-white' : 'mr-auto rounded-tr-lg bg-gray-300 dark:bg-gray-700'} shadow`}
            >
              <div className='text-sm'>
                <p className='text-[0.83rem] font-bold'>
                  {msg.sender_id === 'webapp' ? '' : `${msg.sender_id}`}
                </p>
                {msg.msg} {msg.data ? JSON.stringify(msg.data) : ''}
                {msg.receivers ? ` , Receivers: ${msg.receivers}` : ''}
              </div>
              {msg.timestamp && (
                <div
                  className={`mt-1 flex justify-end text-xs ${msg.sender_id === 'webapp' ? 'text-white' : 'text-gray-500 dark:text-gray-200'}`}
                >
                  {msg.timestamp}
                </div>
              )}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
