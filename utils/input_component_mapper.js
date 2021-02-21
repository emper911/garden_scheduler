import { DHT } from '../components/input_components.js';

export const input_component_mapper = (component) => {
  switch (component.type) {
    case 'dht':
      return { id: component.id, type: 'dht', component: new DHT(component.config) }
    default:
      return { id: null, type: null, component: null };
  }
};

