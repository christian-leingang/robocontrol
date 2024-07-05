"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

// components/PublishButtons.js
const PublishButtons = ({ client, topic, setOwnMessages }) => {

  const [speedInput, setSpeedInput] = useState(60);

  const publishMessage = (message) => {
    if (client) {
      client.publish(topic, message);
    }
  };

  const [allChecked, setAllChecked] = useState(true);
  const [checkboxes, setCheckboxes] = useState({
    robot_1: true,
    robot_2: true,
    robot_3: true,
  });
  const allCheckboxRef = useRef(null);
  const activeChecksCount = Object.values(checkboxes).filter(isChecked => isChecked).length;


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
    console.log(e)
    setCheckboxes({ ...checkboxes, [id]: e });
  };

  function sendSpeed(speed) {

    let message = {
      "msg": "set_speed",
      "sender_id": "webapp",
      "data": {"speed": -speed},
      "receivers": Object.keys(checkboxes).filter(key => checkboxes[key]).map(key => key.split('_')[1])
    }
    if (client && client.connected) {
      client.publish(topic, JSON.stringify(message));
    }
  }

  return (
    <div className="p-4 mx-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Publish Messages</h2>

      <div className="checkboxes flex gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="all_robots" ref={allCheckboxRef} checked={allChecked} onCheckedChange={handleAllChange} />
          <label htmlFor="all_robots" className="font-medium">All Robots</label>
        </div>
        {Object.entries(checkboxes).map(([id, checked]) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox id={id} checked={checked} onCheckedChange={handleCheckboxChange(id)} />
            <label htmlFor={id} className="font-medium">{`Robot ${id.split('_')[1]}`}</label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
      <Button onClick={() => publishMessage('Pause_Robot')} className="my-4 px-4 py-2 rounded-md shadow-lg bg-yellow-500" disabled={activeChecksCount === 0}>
        Pause Robot
      </Button>
      <Button onClick={() => publishMessage('Pause_Robot')} className="my-4 px-4 py-2 rounded-md shadow-lg bg-red-600" disabled={activeChecksCount === 0}>
        Stop Robot
      </Button>
      </div>
      <div>
        <Label htmlFor='speed'>Speed</Label>
      <div className='flex mb-2 max-w-sm items-center gap-2'>
        <Button onClick={sendSpeed(25)} className="px-4 py-2 rounded-md shadow-lg hover:bg-green-600" disabled={activeChecksCount === 0}>25%</Button>
        <Button onClick={() => publishMessage(`Update Speed: ${speedInput}`)} className="px-4 py-2 rounded-md shadow-lg hover:bg-green-600" disabled={activeChecksCount === 0}>50%</Button>
        <Button onClick={() => publishMessage(`Update Speed: ${speedInput}`)} className="px-4 py-2 rounded-md shadow-lg hover:bg-green-600" disabled={activeChecksCount === 0}>75%</Button>
        <Button onClick={() => publishMessage(`Update Speed: ${speedInput}`)} className="px-4 py-2 rounded-md shadow-lg hover:bg-green-600" disabled={activeChecksCount === 0}>100%</Button>
      </div>
      <div className='flex items-center gap-2'>
            <Input type='number' id='speed' value={speedInput} onChange={(e) => setSpeedInput(e.target.value)} min="10" max="100" className="border-2 border-gray-300 rounded-md p-1 max-w-[5rem]"/>
            <Button onClick={() => publishMessage(`Update Speed: ${speed}`)} className="px-4 py-2 rounded-md shadow-lg hover:bg-green-600" disabled={activeChecksCount === 0}>Update Speed</Button>
      </div>
      </div>
      <div>

     
      </div>
    </div>
  );
};

export default PublishButtons;
