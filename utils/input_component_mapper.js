import { DHT } from '../components/input_components';

export const input_component_mapper = (component) => {
  switch (component.type) {
    case 'dht':
      return { type: 'dht', component: new DHT(component.config) }
    default:
      return { type: null, component: null };
  }
};

