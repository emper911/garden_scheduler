import sensor from 'node-dht-sensor';
import { stringDeepCopy } from '../utils/helpers.js';

const dht11Promise = sensor.promises;

class Sensors {
  constructor(config) {
  this._data = null;
  }

  _get_data = () => {
    return stringDeepCopy(this._data);
  }

  _set_data = (data) => {
    this._data = data;
  }

  get_sensor_data = async () => {
    return this._get_data();
  }
}

export class DHT extends Sensors {
  constructor(config) {
    super();
    this.version = config.version;
    this.data_pin = config.data_pin;
    this.update_interval_ms = config.update_interval_ms;
    this.last_read_date = new Date();
  }

  _read_data = async () => {
    const data = await dht11Promise.read(this.version, this.data_pin);
    return data;
  }

  get_sensor_data = async () => {
    const current_time = new Date();
    if (current_time.getTime() - this.last_read_date.getTime() > this.update_interval_ms || !this._data) {
      const data = await this._read_data();
      this._set_data(data);
      this.last_read_date = current_time;
      return data;
    }
    return this._get_data();
  }
}