import { Light } from '../../components/output_components.js';
import config from '../../config/application_config.js';

const { gpio_config } = config;
const light1 = new Light(gpio_config.output[0].config);
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
    console.log('on');
    light1.power_control();
    await sleep(3000);
    console.log('off');
    light1.power_control();
    await sleep(3000);
    console.log('on');
    light1.power_control();
    await sleep(3000);
    console.log('off');
    light1.power_control();
    await sleep(3000);
    console.log('off final');
    light1.power_control(false)
}

test();
