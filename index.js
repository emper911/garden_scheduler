import express from 'express';
import config from './config/application_config.js';
import { logger } from './utils/express_helpers.js';
import { input_component_mapper } from './utils/input_component_mapper.js';
import * as ScheduleController from './controllers/scheduleController.js';

const { server, gpio_config } = config;
const INPUT_COMPONENT_MAPPING = gpio_config.input.map(input_component_mapper);

const app = express()
app.use(logger);
app.use(express.static('public'));
const port = server.port;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Hydro Controller  listening at http://localhost:${port}`)
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
  const { type = '' } = req.body;
  const sensor_data = INPUT_COMPONENT_MAPPING
    .filter(sensor => sensor.type === type)
    .map(sensor => ({ id: sensor.id, type, data: sensor.get_sensor_data() }));
  res.send(sensor_data);
});

// {hour: 14, minute: 30, dayOfWeek: 0}
// [ { id, jobId, time, type, schedAction, action, timezone }]
app.get('/schedule/one', ScheduleController.getOne);
app.get('/schedule/many', ScheduleController.getMany);
app.get('/schedule/all', ScheduleController.getAll);
app.post('/schedule/one', ScheduleController.scheduleOne);
app.post('/schedule/many', ScheduleController.scheduleMany);
