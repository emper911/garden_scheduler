import { DHT } from '../../components/input_components.js';
import config from '../../config/application_config.js';
const { gpio_config } = config;
const dht11 = new DHT(gpio_config.input[0].config);

const funct = async () => {
    const data = await dht11.get_sensor_data();
    console.log(data);
};

funct()

