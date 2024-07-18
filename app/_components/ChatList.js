import { Button } from '@/components/ui/button';
import { IconCar, IconCircleFilled, IconPingPong } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import CustomTooltip from './CustomTooltip';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ROBOT_STATES = Object.freeze({
  OFFLINE: 'offline',
  READY: 'ready',
  RUNNING: 'running',
});

const ChatList = ({ client, configTopic, connectStatus, setReloadConfig }) => {
  const notify = (robot_id) => toast(`Robot ${robot_id} is offline`, { type: 'error' });

  const senderIdWebApp = 99;
  const [pingPong, setPingPong] = useState(false);
  const [messages, setMessages] = useState([]);
  const [robotStates, setRobotStates] = useState([
    { robot_id: 1, status: ROBOT_STATES.OFFLINE, lastPong: new Date().setHours(0, 0, 0) },
    { robot_id: 2, status: ROBOT_STATES.OFFLINE, lastPong: new Date().setHours(0, 0, 0) },
    { robot_id: 3, status: ROBOT_STATES.OFFLINE, lastPong: new Date().setHours(0, 0, 0) },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!pingPong) return;

    const intervalId = setInterval(() => {
      if (connectStatus === 'Connected') {
        const message = { msg: 'ping', sender_id: 99 };
        client.publish(configTopic, JSON.stringify(message));
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [client, connectStatus, configTopic, pingPong]);

  useEffect(() => {
    if (!client) return;

    if (client) {
      client.on('message', (topic, message) => {
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message.toString());

          if (parsedMessage.msg === 'ping') return;

          if (parsedMessage.msg === 'pong') {
            const robotId = parsedMessage.sender_id;
            setRobotStates((prevStates) => {
              const newStates = [...prevStates];
              newStates[robotId - 1].lastPong = new Date();
              if (prevStates[robotId - 1].status === ROBOT_STATES.OFFLINE)
                newStates[robotId - 1].status = ROBOT_STATES.READY;

              return newStates;
            });
          }

          if (parsedMessage.msg === 'robot_ready' || parsedMessage.msg === 'robot_stop') {
            updateRobotState('ready', parsedMessage.sender_id);
          } else if (parsedMessage.msg === 'robot_start') {
            updateRobotState('running', parsedMessage.sender_id);
          } else if (parsedMessage.msg === 'robot_end') {
            updateRobotState('offline', parsedMessage.sender_id);
          }
          if (parsedMessage.msg === 'robot_ready' && parsedMessage.sender_id === 1) {
            setReloadConfig(parsedMessage.data);
          }
          parsedMessage.timestamp = timestamp;
        } catch (error) {
          parsedMessage = { msg: message.toString(), sender_id: 'unknown', timestamp };
        }
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      });
    }
  }, [client, setReloadConfig]);

  useEffect(() => {
    if (!pingPong) return;

    const checkRobotsOffline = () => {
      const newStates = robotStates.map((robot) => {
        const timeSinceLastPong = new Date() - new Date(robot.lastPong);
        if (timeSinceLastPong > 8000 && robot.status !== ROBOT_STATES.OFFLINE) {
          notify(robot.robot_id);
          return { ...robot, status: 'offline' };
        }
        return robot;
      });

      if (JSON.stringify(robotStates) !== JSON.stringify(newStates)) {
        setRobotStates(newStates);
      }
    };

    const intervalId = setInterval(checkRobotsOffline, 1000);

    return () => clearInterval(intervalId);
  }, [pingPong, robotStates]);

  const updateRobotState = (newState, senderId) => {
    setRobotStates((prevStates) => {
      const newStates = [...prevStates];
      if (newStates[senderId - 1] !== undefined) {
        newStates[senderId - 1].status = newState;
        newStates[senderId - 1].lastPong = new Date();
      }
      return newStates;
    });
  };

  return (
    <div className='mx-auto h-[72vh] rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-slate-800'>
      <div className='flex flex-row items-baseline justify-between'>
        <h2 className='ml-4 mt-4 text-2xl font-semibold'>Chat</h2>

        <div className='mr-4 flex items-center gap-4'>
          <Button variant='primary' onClick={() => setPingPong(!pingPong)}>
            <IconPingPong stroke={2} color={pingPong ? 'green' : 'red'} />
          </Button>
          {robotStates.map(({ robot_id, status, lastPong }, index) => (
            <RoboStatus
              key={index}
              robot_id={robot_id}
              status={status}
              lastPong={lastPong}
              pingPong={pingPong}
            />
          ))}
        </div>
      </div>
      <div className='flex h-[calc(72vh-3rem)] flex-col-reverse overflow-auto'>
        {messages.length === 0 && (
          <div className='my-auto flex h-full items-center justify-center text-sm'>
            No messages yet
          </div>
        )}
        <ul className='mx-2 space-y-2'>
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`w-3/4 rounded-b-lg p-2 ${msg.sender_id === senderIdWebApp ? 'ml-auto rounded-tl-lg bg-blue-500 text-white' : 'mr-auto rounded-tr-lg bg-gray-300 dark:bg-gray-700'} shadow`}
            >
              <div className='text-sm'>
                <p className='text-[0.83rem] font-bold'>
                  {msg.sender_id === senderIdWebApp ? '' : `${msg.sender_id}`}
                </p>
                {msg.msg} {msg.data ? JSON.stringify(msg.data) : ''}
                {msg.receivers ? ` , Receivers: ${msg.receivers}` : ''}
              </div>
              {msg.timestamp && (
                <div
                  className={`mt-1 flex justify-end text-xs ${msg.sender_id === senderIdWebApp ? 'text-white' : 'text-gray-500 dark:text-gray-200'}`}
                >
                  {msg.timestamp}
                </div>
              )}
            </li>
          ))}
          <ToastContainer />

          <div ref={messagesEndRef} />
        </ul>
      </div>
    </div>
  );
};

function getColorFromState(state) {
  switch (state) {
    case ROBOT_STATES.OFFLINE:
      return 'gray';
    case ROBOT_STATES.READY:
      return 'orange';
    case ROBOT_STATES.RUNNING:
      return 'green';
    default:
      return 'red';
  }
}

function RoboStatus({ robot_id, status, lastPong, pingPong }) {
  const [timeSinceLastPongString, setTimeSinceLastPongString] = useState('offline');
  const [color, setColor] = useState(getColorFromState(status));

  useEffect(() => {
    setColor(getColorFromState(status));
    const updateSecondsAgo = () => {
      const timeSinceLastPong = new Date() - new Date(lastPong);
      let minutes = Math.floor(timeSinceLastPong / 60000);
      let seconds = Math.floor((timeSinceLastPong % 60000) / 1000);
      let newTimeSinceLastPongString = `${seconds} seconds ago`;

      if (minutes > 0) {
        newTimeSinceLastPongString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      if (timeSinceLastPong > 360000) {
        newTimeSinceLastPongString = 'offline';
      }
      setTimeSinceLastPongString(newTimeSinceLastPongString);
    };

    updateSecondsAgo();

    const intervalId = setInterval(updateSecondsAgo, 1000);
    return () => clearInterval(intervalId);
  }, [status, lastPong]);

  return (
    <div>
      {pingPong ? (
        <CustomTooltip tooltipText={timeSinceLastPongString}>
          <div className='mt-[6px] flex items-center gap-2'>
            <div className='flex'>
              <IconCar stroke={2} />
              {robot_id}:
            </div>
            <IconCircleFilled stroke={2} size={16} color={color} />
          </div>
        </CustomTooltip>
      ) : (
        <div className='flex items-center gap-2'>
          <div className='flex'>
            <IconCar stroke={2} />
            {robot_id}:
          </div>
          <IconCircleFilled stroke={2} size={16} color={color} />
        </div>
      )}
    </div>
  );
}

export default ChatList;
