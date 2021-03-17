import express from 'express';
import config from './config/application_config.js';
import { logger } from './utils/express_helpers.js';
import { input_component_mapper } from './utils/input_component_mapper.js';
import * as ScheduleController from './controllers/scheduleController.js';

const { server, gpio_config } = config;
const INPUT_COMPONENT_MAPPING = gpio_config.input.map(input_component_mapper);

const app = express();
// parse application/x-www-form-urlencoded
app.use(express.urlencoded()) 
// parse application/json
app.use(express.json())
app.use(logger);
app.use(express.static('public'));

const port = server.port;
app.listen(port, () => {
  console.log(`Hydro Controller  listening at http://localhost:${port}`)
});


app.get('/', (req, res) => {
  res.send('Hello World!')
});

// app.get('/state', async (req, res) => {
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders(); // flush the headers to establish SSE with client
  
//   update_dht_sensor();
//   res.write(`data: ${JSON.stringify(STATE)}`);

//   // If client closes connection, stop sending events
//   res.on('close', () => {
//       console.log('client dropped me');``
//       res.end();
//   });
// });

app.get('/sensors', async (req, res) => {
  const { type = '' } = req.query;
  try {
    const sensor_data_promises = INPUT_COMPONENT_MAPPING
      .filter(sensor => sensor.type === type)
      .map(async sensor => {
        const data = { id: sensor.id, type, data: await sensor.component.get_sensor_data() };
        return data;
      });
    const sensor_data = await Promise.all(sensor_data_promises);
    res.send(sensor_data);
  } catch (err) {
    console.log(err);
  }
});

// {
//   "schedule": {
//       "id": "light-1",
//       "time": "*/8 * * * * *",
//       "type": "light",
//       "schedAction": "STOP",
//       "timezone": "america/new_york"
//   },
//   "jobId": "light-2021-03-04T04:59:33.449Z"
// }
app.get('/schedule/one', ScheduleController.getOne);
app.get('/schedule/many', ScheduleController.getMany);
app.get('/schedule/all', ScheduleController.getAll);
app.post('/schedule/one', ScheduleController.scheduleOne);
app.post('/schedule/many', ScheduleController.scheduleMany);
