import { Gpio } from 'pigpio';


export class Light {
  constructor(light_config) {
    this.power_pin = light_config.power_pin;
    this.power_gpio = new Gpio(this.power_pin, { mode: Gpio.OUTPUT });
    this.power_control = this.power_control.bind(this);
  }

  power_control = (power) => {
    const write_number = power ? 1 : 0;
    this.power_gpio.digitalWrite(power);
  }
}

export class Pump {
  constructor(id, pin=9) {
    this.gpio_1 = new Gpio(pin, { mode: Gpio.OUTPUT });
    this.power_control = this.power_control.bind(this);
  }

  power_switch = (power) => {
    const write_number = power ? 1 : 0;
    this.gpio_1.digitalWrite(power);
  }
}