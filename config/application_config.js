const config = {
  server: {
    port: 3000
  },
  gpio_config: {
    input: [
      { 
        id: "dht-1",
        type: "dht",
        config: {
          data_pin: 4,
          version: 11,
          update_interval_ms: 3000
        }
      }
    ],
    output: [
      {
        id: "light-1",
        type: "light",
        config: {
          power_pin: 17
        }
      }
    ]
  }
};
export default config;