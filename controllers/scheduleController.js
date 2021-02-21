import { CronJob, CronTime } from 'cron';
import config from '../config/application_config.js';
import { output_component_mapper } from '../utils/output_component_mapper.js';

const { gpio_config } = config;
const OUTPUT_COMPONENT_MAPPING = gpio_config.output.map(output_component_mapper);
let ACTIVE_JOBS = [];

const getJob = (id) => id ? ACTIVE_JOBS.find(j => j.id === id) : null;
const setJob = (job) => ACTIVE_JOBS.push(job);
const removeJob = (id) => ACTIVE_JOBS = ACTIVE_JOBS.filter(j => j.id !== id);
const getJobInfo = (id) => {
  const existingJob = getJob(id);
  if (existingJob) return { id, sched: existingJob.sched };
  else return null;
};
// will have to account for non power type actions
const createJob = (sched, component) => {
  const returnJob = {};
  returnJob.id = `${sched.type}-${new Date().getUTCDate()}`;
  returnJob.job = new CronJob(sched.time, component.power_control.bind(null, true), component.power_control.bind(null, false), sched.timezone);
  returnJob.sched = sched;
  setJob(returnJob);
};
const rescheduleJob = (sched, job) => {
  job.setTime(new CronTime(sched.time));
};
const cancelJob = (id, job) => {
  job.stop();
  removeJob(id);
}

const cronJobManager = (sched, component) => {
  const schedJobId = sched.jobId;
  const existingJob = schedJobId !== undefined ? getJob(schedJobId) : null;
  switch (sched.schedAction) {
    case 'CREATE':
      createJob(sched, component);
    case 'RESCHEDULE':
      if (existingJob) rescheduleJob(sched, existingJob);
      break;
    case 'CANCEL':
      if (existingJob) cancelJob(schedJobId, existingJob);
      break;
    default:
      break;
  }
}

export const getOne = (req, res) => {
  const { jobId = '' } = req.params;
  if (!jobId) res.status(400).send({ message: 'Cannot find job' });
  const existingJobInfo = getJobInfo(jobId);
  if (existingJobInfo) res.send(existingJobInfo);
  else res.status.send({ message: 'Cannot find job info'});
};

export const getMany = async (req, res) => {
  const { jobIdArray = [] } = req.body;
  try {
    const activeJobInfoPromise = jobIdArray.map(async id => getJobInfo(id));
    const activeJobInfo = await Promise.all(activeJobInfoPromise);
    res.send(activeJobInfo);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

export const getAll = async (req, res) => {
  try {
    const activeJobInfoPromise = ACTIVE_JOBS.map(async j => ({ id: j.id, sched: j.sched}));
    const activeJobInfo = await Promise.all(activeJobInfoPromise);
    res.send(activeJobInfo);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

export const scheduleOne = (req, res) => {
  const { schedule } = req.body;
  try {
    const component = OUTPUT_COMPONENT_MAPPING.find(comp => comp.id === schedule.id)?.component;
    if (component !== undefined) cronJobManager(schedule, component);
    else res.status(400).send({ message: 'Cannot find component' });
  } catch (err) {
    res.status(500).send({'message': err});
  }
}

export const scheduleMany = (req, res) => {
  const { scheduleArray = [] } = req.body;
  try {
    scheduleArray.map((sched) => {
      const component = OUTPUT_COMPONENT_MAPPING.find(comp => comp.id === sched.id)?.component;
      if (component !== undefined) cronJobManager(sched, component);
      else res.status(400).send({ message: 'Cannot find component' });
    });
  } catch (err) {
    res.status(500).send({'message': err});
  }
};
