import { Gpio } from 'pigpio';
import config from '../../config/application_config.js';

const { gpio_config } = config;
const LIGHT_PIN = gpio_config.output[0].config.power_pin;

const gpio_lights = new Gpio(LIGHT_PIN, { mode: Gpio.OUTPUT });

const power_control = (power) => {
    const write_number = power ? 1 : 0;
    gpio_lights.digitalWrite(power);
}
setTimeout(() => {
    power_control(true);
    console.log('true');
}, 1000);

setTimeout(() => {
    power_control(false);
    console.log('false');
}, 10000);
