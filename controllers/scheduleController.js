import { CronJob, CronTime } from 'cron';
import config from '../config/application_config.js';
import { output_component_mapper } from '../utils/output_component_mapper.js';

const { gpio_config } = config;
const OUTPUT_COMPONENT_MAPPING = gpio_config.output.map(output_component_mapper);
let ACTIVE_JOBS = [];

const getJob = (jobId) => jobId ? ACTIVE_JOBS.find(j => j.id === jobId) : null;

const setJob = (job) => ACTIVE_JOBS.push(job);

const removeJob = (jobId) => ACTIVE_JOBS = ACTIVE_JOBS.filter(j => j.id !== jobId);

const getJobInfo = (jobId) => {
  const existingJob = getJob(jobId);
  if (existingJob) return { jobId, sched: existingJob.sched };
  else return null;
};

// will have to account for non power type actions
const createJob = (sched, component) => {
  const returnJob = {};
  returnJob.id = `${sched.type}-${new Date().toISOString()}`;
  returnJob.job = new CronJob(sched.time, () => component.power_control(), () => component.power_control(false), sched.timezone);
  returnJob.job.start();
  returnJob.sched = sched;
  setJob(returnJob);
  return { jobId: returnJob.id, sched: returnJob.sched };
};

const rescheduleJob = (jobId, sched, job) => {
  existingJob.job.setTime(new CronTime(sched.time));
  return { jobId, sched };
};

const stopJob = (jobId, existingJob) => {
  existingJob.job.stop();
  removeJob(jobId);
  return jobId;
}

const cronJobManager = (jobId, sched, component) => {
  const existingJob = jobId ? getJob(jobId) : null;
  let returnJob = null;
  switch (sched.schedAction) {
    case 'START':
      returnJob = createJob(sched, component);
    case 'RESCHEDULE':
      if (existingJob) returnJob = rescheduleJob(jobId, sched, existingJob);
      break;
    case 'STOP':
      if (existingJob) returnJob = stopJob(jobId, existingJob);
      break
    default:
      break;
  }
  return returnJob;
}

export const getOne = (req, res) => {
  const { jobId = '' } = req.query;
  if (!jobId) res.status(400).send({ message: 'Cannot find job' });
  const existingJobInfo = getJobInfo(jobId);
  if (existingJobInfo) res.send(existingJobInfo);
  else res.status.send({ message: 'Cannot find job info' });
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
    const activeJobInfoPromise = ACTIVE_JOBS.map(async j => ({ id: j.id, sched: j.sched }));
    const activeJobInfo = await Promise.all(activeJobInfoPromise);
    res.send(activeJobInfo);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

export const scheduleOne = (req, res) => {
  const { schedule = null, jobId = '' } = req.body;
  let returnJob = null;
  try {
    if (!schedule) throw new Error('Cannot read schedule');
    const component = OUTPUT_COMPONENT_MAPPING.find(comp => comp.id === schedule.id).component;
    if (component !== undefined) returnJob = cronJobManager(jobId, schedule, component);
    else res.status(400).send({ message: 'Cannot find component' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ 'message': err });
  }
  res.send(returnJob);
}

export const scheduleMany = (req, res) => {
  const { scheduleArray = [] } = req.body;
  let returnJobArray = null;
  try {
    returnJobArray = scheduleArray.map((item) => {
      const { jobId = '', schedule = null } = item;
      if (!schedule) res.status(400).send({ message: 'No Schedule object provided!' });
      const component = OUTPUT_COMPONENT_MAPPING.find(comp => comp.id === schedule.id) ? .component;
      if (component === undefined) res.status(400).send({ message: 'Cannot find component' });
      return cronJobManager(jobId, schedule, component);
    });
  } catch (err) {
    res.status(500).send({ 'message': err });
  }
  res.send(returnJobArray);
};