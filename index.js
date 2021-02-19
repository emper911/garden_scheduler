import express from 'express';
import schedule from 'node-schedule';
import config from './config/application_config.js';
import { logger } from './utils/express_helpers.js';
import { input_component_mapper } from './utils/input_component_mapper';
import { output_component_mapper } from './utils/output_component_mapper';

const { server, gpio_config } = config;
const INPUT_COMPONENT_MAPPING = gpio_config.output.map(input_component_mapper);
const OUTPUT_COMPONENT_MAPPING = gpio_config.input.map(output_component_mapper);

const app = express()
app.use(logger);
app.use(express.static('public'));
const port = server.port;

const ACTIVE_JOBS = [];
const SCHEDULE = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.listen(port, () => {
  console.log(`Hydro Controller  listening at http://localhost:${port}`)
});


app.get('/state', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client
  
  update_dht_sensor();
  res.write(`data: ${JSON.stringify(STATE)}`);

  // If client closes connection, stop sending events
  res.on('close', () => {
      console.log('client dropped me');``
      res.end();
  });
});


app.get('/sensors', async (req, res) => {
  const { type = '' } = req.body;
  const sensor_data = INPUT_COMPONENT_MAPPING
    .filter(sensor => sensor.type === type)
    .map(sensor => ({ id: sensor.id, type, data: sensor.get_sensor_data() }));
  res.send(sensor_data);
});

// {hour: 14, minute: 30, dayOfWeek: 0}
// [ { id, time, power, }]
app.post('/schedule', async (req, res) => {
  const { scheduleArray = [] } = req.body;
  try {
    scheduleArray.map((sched) => {
      let returnJob = {}, returnScheduled = {};
      if (sched.id !== undefined) {
        const existingJob = ACTIVE_JOBS.filter(j => j.id === sched.id)[0];
        if (existingJob === undefined) throw Error('job id not found');
        if (sched.action === 'reschedule') existingJob.reschedule(sched.time);
        else if (sched.action === 'cancel') existingJob.cancel();
      } else {
        const job = schedule.scheduleJob(sched.time, () => {
          const pin = OUTPUT_PIN_MAPPING[sched.type];
          if (pin === undefined) throw Error('Output type not found');
          if (sched.power !== undefined) power_control(pin, sched.power);
        });
        const id = `${sched.type}-${new Date().getUTCDate()}`;
        returnJob = { id, job};
        ACTIVE_JOBS.push(returnJob);
        returnScheduled = { id, ...sched };
        STATE.scheduled.push(returnScheduled);
      }
    });
  } catch (err) {
    res.status(500).send({'message': err});
  }
});
