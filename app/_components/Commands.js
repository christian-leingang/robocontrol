'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay, IconPlayerSkipForward, IconX } from '@tabler/icons-react';

const PublishButtons = ({ client, topic, reloadConfig }) => {
  const [speedInput, setSpeedInput] = useState(60);
  const [randomActionsTimeout, setRandomActionsTimeout] = useState(10);
  const [randomActions, setRandomActions] = useState(false);
  const [communication, setCommunication] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(false);
  const speedIntervall = [25, 50, 75, 100];

  const [allChecked, setAllChecked] = useState(true);
  const [checkboxes, setCheckboxes] = useState({
    robot_1: true,
    robot_2: true,
    robot_3: true,
  });
  const allCheckboxRef = useRef(null);
  const activeChecksCount = Object.values(checkboxes).filter((isChecked) => isChecked).length;

  useEffect(() => {
    const allSelected = Object.values(checkboxes).every(Boolean);
    const anySelected = Object.values(checkboxes).some(Boolean);

    setAllChecked(allSelected);
    allCheckboxRef.current.indeterminate = !allSelected && anySelected;
  }, [checkboxes]);

  useEffect(() => {
    console.log('Reload Config', reloadConfig);

    if (reloadConfig) {
      setRandomActions(reloadConfig.randomActions);
      setCommunication(reloadConfig.communication);
      setActiveSimulation(reloadConfig.activeSimulation);
    }
  }, [reloadConfig]);

  const handleAllChange = (e) => {
    const isChecked = e;
    setAllChecked(isChecked);
    setCheckboxes({
      robot_1: isChecked,
      robot_2: isChecked,
      robot_3: isChecked,
    });
  };

  const handleCheckboxChange = (id) => (e) => {
    setCheckboxes({ ...checkboxes, [id]: e });
  };

  const buttonConfigs = [
    { action: sendPause, color: 'bg-yellow', text: 'Pause', icon: IconPlayerPause },
    { action: sendUnpause, color: 'bg-emerald', text: 'Resume', icon: IconPlayerSkipForward },
  ];

  function createMessage(msg, data = null, specificReceivers = false) {
    return {
      msg,
      sender_id: 99,
      data,
      receivers: specificReceivers
        ? Object.keys(checkboxes)
            .filter((key) => checkboxes[key])
            .map((key) => +key.split('_')[1])
        : null,
    };
  }

  function sendMessage(message) {
    if (client && client.connected) {
      client.publish(topic, JSON.stringify(message));
    }
  }

  function sendStartSimulation() {
    setActiveSimulation(true);
    const message = createMessage('start_simulation');
    sendMessage(message);
  }

  function sendPause() {
    const message = createMessage('pause_robot');
    sendMessage(message);
  }

  function sendSpeed(speed) {
    const message = createMessage('set_speed', { speed: -speed }, true);
    sendMessage(message);
  }

  function sendEndSimulation() {
    setActiveSimulation(false);
    setCommunication(false);
    setRandomActions(false);
    const message = createMessage('end_simulation');
    sendMessage(message);
  }

  function sendUnpause() {
    const message = createMessage('resume_robot');
    sendMessage(message);
  }

  function sendRandomActionsTimeout() {
    const message = createMessage('set_random_actions_timeout', { timeout: randomActionsTimeout });
    sendMessage(message);
  }

  function toggleRandomActions() {
    setRandomActions((prev) => !prev);
    const message = createMessage(
      randomActions ? 'disable_random_actions' : 'enable_random_actions',
    );
    sendMessage(message);
  }

  function toggleCommunication() {
    setCommunication((prev) => !prev);
    const message = createMessage(communication ? 'disable_communication' : 'enable_communication');
    sendMessage(message);
  }

  return (
    <div className='mx-auto h-fit min-h-[72vh] rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-800 dark:bg-slate-800'>
      <h2 className='mb-4 text-2xl font-semibold'>Publish Messages</h2>

      <div className='flex items-center gap-2'>
        {activeSimulation ? (
          <Button
            onClick={sendEndSimulation}
            className={`my-2 rounded-md bg-zinc-500 px-4 py-2 shadow-md hover:bg-zinc-500 hover:brightness-95`}
          >
            <p className='mr-1'>End Simulation</p> <IconX size={20} />
          </Button>
        ) : (
          <Button
            onClick={sendStartSimulation}
            className={`my-2 rounded-md bg-green-500 px-4 py-2 shadow-md hover:bg-green-500 hover:brightness-95`}
          >
            <p className='mr-1'>Start Simulation</p> <IconPlayerPlay size={20} />
          </Button>
        )}
      </div>

      <div className={`${activeSimulation ? '' : 'hidden'}`}>
        <div className='my-2 flex items-start gap-2'>
          <div className='flex cursor-pointer items-center space-x-3 rounded-lg bg-gray-200 p-2 pr-3 shadow-md transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'>
            <Checkbox
              id='communication'
              checked={communication}
              onCheckedChange={toggleCommunication}
            />
            <label htmlFor='communication' className='cursor-pointer font-medium'>
              Communication
            </label>
          </div>
          <div className='flex cursor-pointer items-center space-x-3 rounded-lg bg-gray-200 p-2 pr-3 shadow-md transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'>
            <Checkbox
              id='random_actions'
              checked={randomActions}
              onCheckedChange={toggleRandomActions}
            />
            <label htmlFor='random_actions' className='cursor-pointer font-medium'>
              Random Actions
            </label>
          </div>
          {randomActions && (
            <>
              <Input
                type='number'
                id='random_actions_timeout'
                value={randomActionsTimeout}
                onChange={(e) => setRandomActionsTimeout(e.target.value)}
                min='5'
                max='50'
                step='10'
                disabled={activeChecksCount === 0}
                className='ml-4 w-fit rounded-md border-2 border-gray-300 p-1'
              />
              <Button
                onClick={() => sendRandomActionsTimeout(randomActionsTimeout)}
                className='rounded-md px-4 py-2 shadow-md'
                disabled={activeChecksCount === 0}
              >
                Update Timeout
              </Button>
            </>
          )}
        </div>

        <h3 className='mt-8 text-xl font-semibold'>Receivers</h3>
        <div className='checkboxes my-2 flex gap-2'>
          <div className='flex cursor-pointer items-center space-x-2 rounded-lg bg-gray-200 px-3 shadow-md transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'>
            <Checkbox
              id='all_robots'
              ref={allCheckboxRef}
              checked={allChecked}
              onCheckedChange={handleAllChange}
            />
            <label htmlFor='all_robots' className='cursor-pointer font-medium'>
              All Robots
            </label>
          </div>
          {Object.entries(checkboxes).map(([id, checked]) => (
            <div
              key={id}
              className='flex cursor-pointer items-center space-x-2 rounded-lg bg-gray-200 p-2 px-3 shadow-md transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'
            >
              <Checkbox id={id} checked={checked} onCheckedChange={handleCheckboxChange(id)} />
              <label
                htmlFor={id}
                className='cursor-pointer font-medium text-gray-900 dark:text-gray-200'
              >{`Robot ${id.split('_')[1]}`}</label>
            </div>
          ))}
        </div>
        <h3 className='mt-6 text-xl font-semibold'>Actions</h3>

        <div className='flex items-center gap-2'>
          {buttonConfigs.map(({ action, color, text, icon: Icon }) => (
            <Button
              key={text}
              onClick={action}
              className={`my-2 rounded-md ${color}-500 w-1/5 px-4 py-2 shadow-md hover:brightness-95 hover:${color}-500`}
              disabled={activeChecksCount === 0}
            >
              <p className='mr-1'>{text}</p> <Icon size={20} />
            </Button>
          ))}
        </div>
        <div>
          <h3 className='mt-5 text-xl font-bold'>Speed</h3>
          <div className='my-2 flex items-center gap-2'>
            {speedIntervall.map((speed) => (
              <Button
                key={speed}
                onClick={() => sendSpeed(speed)}
                className='w-1/4 rounded-md px-4 py-2 shadow-md'
                disabled={activeChecksCount === 0}
              >
                {speed}%
              </Button>
            ))}
          </div>
          <div className='flex items-center gap-2'>
            <Input
              type='number'
              id='speed'
              value={speedInput}
              onChange={(e) => setSpeedInput(e.target.value)}
              min='10'
              max='100'
              step='10'
              disabled={activeChecksCount === 0}
              className='w-1/2 rounded-md border-2 border-gray-300 p-1'
            />
            <Button
              onClick={() => sendSpeed(speedInput)}
              className='w-1/2 rounded-md px-4 py-2 shadow-md'
              disabled={activeChecksCount === 0}
            >
              Update Speed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishButtons;
