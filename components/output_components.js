import { Gpio } from 'pigpio';
import { stringDeepCopy } from '../utils/helpers';


export class Light {
  constructor(light_config) {
    this.power_pin = light_config.power_pin;
    this.power_gpio = new Gpio(this.power_pin, { mode: Gpio.OUTPUT });
    this._data = { power: false };
    this.power_control = this.power_control.bind(this);
    this.get_data = this.get_data.bind(this);
    this._set_data = this._set_data.bind(this);
  }

  get_data = (id = '') => {
    if (id) return stringDeepCopy(this._data[id]);
    else return stringDeepCopy(this._data);
  }

  _set_data = (id, value) => {
    this._data[id] = value;
  }

  power_control = (power) => {
    const write_number = power ? 1 : 0;
    this.power_gpio.digitalWrite(power);
    this._set_data('power', power);
  }
}

export class Pump {
  constructor(id, pin=9) {
    this.gpio_1 = new Gpio(pin, { mode: Gpio.OUTPUT });
    this._data = { power: false };
    this.power_control = this.power_control.bind(this);
    this.get_data = this.get_data.bind(this);
    this._set_data = this._set_data.bind(this);
  }

  get_data = (id = '') => {
    if (id) return stringDeepCopy(this._data[id]);
    else return stringDeepCopy(this._data);
  }

  _set_data = (id, value) => {
    this._data[id] = value;
  }

  power_control = (power) => {
    const write_number = power ? 1 : 0;
    this.gpio_1.digitalWrite(power);
    this._set_data('power', power);
  }
}