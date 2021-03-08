const HOST = "http://192.168.1.200:3000"
const POLLING_INTERVAL = 5000;

const state = {
  sensors: [
    {
      id: 'dht-1',
      type: 'dht',
      data: { humidity: null, temperature: null }
    },
  ],
  modifiedDate: new Date().toISOString(),
}

const removeChildrenFromNode = (node) => {
  while (node.firstChild) {
    node.firstChild.remove();
  }
}

const updateSensorLabel = () => {
  const sensorDataDiv = document.getElementById('sensor-data');
  removeChildrenFromNode(sensorDataDiv);
  const newElement = state.sensors.map(sensor => {
    const newTag = document.createElement('p');
    const { data, type, id } = sensor;
    newTag.innerText = `id: ${id}\ntype: ${type}\nhumdity: ${data.humidity}%\ntemperature: ${data.temperature}˚C\nmodified date: ${state.modifiedDate}`;
    sensorDataDiv.appendChild(newTag);
  })
};

const getDHTData = async () => {
  let url = new URL(HOST + '/' + 'sensors?type=dht');
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
    });

    state.sensors = await response.json();
    state.modifiedDate = new Date().toLocaleString();
    console.log(`Data: ${JSON.stringify(state.sensors)}`);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const pollServer = async (pollingInterval) => {
  await getDHTData();
  updateSensorLabel();
  setInterval(async () => {
    await getDHTData();
    updateSensorLabel();
  }, pollingInterval);
}

const init = () => {
  pollServer(POLLING_INTERVAL);
}

window.addEventListener("load", init);
