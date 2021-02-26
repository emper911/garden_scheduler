import { Light } from '../../components/output_components.js';
import config from '../../config/application_config.js';

const { gpio_config } = config;
const light1 = new Light(gpio_config.output[0].config);

light1.power_control(true);
setTimeout(() => light1.power_control(false), 2000);
