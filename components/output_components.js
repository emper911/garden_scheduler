import sensor from 'node-dht-sensor';
import { stringDeepCopy } from '../utils/helpers';

export class DHT {
  constructor(config) {
    this.version = config.version;
    this.data_pin = config.data_pin;
    this.update_interval_ms = config.update_interval_ms;
    this._data = { temperature: null, humidity: null };
    this.last_read_date = new Date();
  }

  get_data = () => {
    return stringDeepCopy(this._data);
  }

  _set_data = (data) => {
    this._data = data;
  }

  read_data = (err, temperature, humidity) => {
    if (err) throw err;
    this._set_data({ temperature, humidity });
  }

  get_data_from_sensor = () => {
    const current_time = new Date();
    if (current_time - this.last_read_date > this.update_interval_ms) {
      sensor.read(this.version, this.data_pin, this.read_data);
    }
    return this.get_data();
  }
}
