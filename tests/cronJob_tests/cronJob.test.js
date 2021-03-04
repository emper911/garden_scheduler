import { CronJob, CronTime, sendAt } from 'cron';
import config from '../../config/application_config.js';
import { output_component_mapper } from '../../utils/output_component_mapper.js';

const { gpio_config } = config;
const OUTPUT_COMPONENT_MAPPING = gpio_config.output.map(output_component_mapper);
const component = OUTPUT_COMPONENT_MAPPING.find(c => c.id === 'light-1').component;
console.log('jobStart');
const job = new CronJob("*/8 * * * * *", () => component.power_control(), () => component.power_control(false), 'america/new_york');
job.start();
setTimeout(() => { console.log('stopping job'); job.stop()}, 20000);
