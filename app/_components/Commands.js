// components/PublishButtons.js
const PublishButtons = ({ client, topic }) => {
  const publishMessage = (message) => {
    if (client) {
      client.publish(topic, message);
    }
  };

  return (
    <div>
      <h2>Publish Messages</h2>
      <button onClick={() => publishMessage('Pause_Robot')}>Pause Robot</button>
      <div>
        <label>
          Speed:
          <input type='number' id='speed' name='speed' />
        </label>
        <button
          onClick={() => {
            const speed = document.getElementById('speed').value;
            publishMessage(`Decrease Speed: ${speed}`);
          }}
        >
          Decrease Speed
        </button>
      </div>
      <div>
        <label>
          <input type='checkbox' id='robot1' name='robot1' /> Robot 1
        </label>
        <label>
          <input type='checkbox' id='robot2' name='robot2' /> Robot 2
        </label>
        <label>
          <input type='checkbox' id='robot3' name='robot3' /> Robot 3
        </label>
      </div>
    </div>
  );
};

export default PublishButtons;
