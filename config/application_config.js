const config = {
  "server": {
    "port": 3000
  },
  "gpio_config": {
    "input": [
      { 
        type: "dht",
        config: {
          data_pin: 4,
          version: 11,
          update_interval_ms: 3000
        }
      }
    ],
    "output": [
      {
        type: "light",
        config: {
          power_pin: 17
        }
      }
    ]
  }
};
export default config;