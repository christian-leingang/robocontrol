'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';

const PublishButtons = ({ client, topic }) => {
  const [speedInput, setSpeedInput] = useState(60);
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
    { action: sendStart, color: 'bg-green', text: 'Start' },
    { action: sendPause, color: 'bg-yellow', text: 'Pause' },
    { action: sendUnpause, color: 'bg-emerald', text: 'Unpause' },
    { action: sendStop, color: 'bg-red', text: 'Stop' },
    { action: sendEnd, color: 'bg-zinc', text: 'End' },
  ];

  function createMessage(msg, data = null) {
    return {
      msg,
      sender_id: 'webapp',
      data,
      receivers: Object.keys(checkboxes)
        .filter((key) => checkboxes[key])
        .map((key) => key.split('_')[1]),
    };
  }

  function sendMessage(message) {
    if (client && client.connected) {
      client.publish(topic, JSON.stringify(message));
    }
  }

  function sendStart() {
    const message = createMessage('start_robot');
    sendMessage(message);
  }

  function sendPause() {
    const message = createMessage('pause_robot');
    sendMessage(message);
  }

  function sendStop() {
    const message = createMessage('stop_robot');
    sendMessage(message);
  }

  function sendSpeed(speed) {
    const message = createMessage('set_speed', { speed: -speed });
    sendMessage(message);
  }

  function sendEnd() {
    const message = createMessage('end_robot');
    sendMessage(message);
  }

  function sendUnpause() {
    const message = createMessage('unpause_robot');
    sendMessage(message);
  }

  return (
    <div className='mx-auto h-[70vh] rounded-lg border border-gray-200 p-4 shadow-md dark:border-gray-700'>
      <h2 className='mb-4 text-xl font-semibold'>Publish Messages</h2>

      <div className='checkboxes flex gap-2'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='all_robots'
            ref={allCheckboxRef}
            checked={allChecked}
            onCheckedChange={handleAllChange}
          />
          <label htmlFor='all_robots' className='font-medium'>
            All Robots
          </label>
        </div>
        {Object.entries(checkboxes).map(([id, checked]) => (
          <div key={id} className='flex items-center space-x-2'>
            <Checkbox id={id} checked={checked} onCheckedChange={handleCheckboxChange(id)} />
            <label htmlFor={id} className='font-medium'>{`Robot ${id.split('_')[1]}`}</label>
          </div>
        ))}
      </div>

      <div className='flex items-center gap-2'>
        {buttonConfigs.map(({ action, color, text }) => (
          <Button
            key={text}
            onClick={action}
            className={`my-4 rounded-md ${color}-500 hover: w-20 px-4 py-2 shadow-lg hover:brightness-95 hover:${color}-500`}
            disabled={activeChecksCount === 0}
          >
            {text}
          </Button>
        ))}
      </div>
      <div>
        <Label htmlFor='speed' className='ext-xl'>
          Speed
        </Label>
        <div className='mb-2 flex max-w-sm items-center gap-2'>
          {speedIntervall.map((speed) => (
            <Button
              key={speed}
              onClick={() => sendSpeed(speed)}
              className='w-20 rounded-md px-4 py-2 shadow-lg'
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
            className='w-[10.5rem] max-w-[15rem] rounded-md border-2 border-gray-300 p-1'
          />
          <Button
            onClick={() => sendSpeed(speedInput)}
            className='w-[10.5rem] rounded-md px-4 py-2 shadow-lg'
            disabled={activeChecksCount === 0}
          >
            Update Speed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishButtons;
