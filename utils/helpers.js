import { DHT } from '../components/input_components';
import { Light } from '../components/output_components';

export const stringDeepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const input_component_mapper = (component) => {
  switch (component.type) {
    case 'light':
      return { type: 'light', component: new Light(component.config) }
    default:
      return { type: null, component: null };
  }
};

export const output_component_mapper = (component) => {
  switch (component.type) {
    case 'dht':
      return { type: 'dht', component:  new DHT(component.config) }
    default:
      return { type: null, component: null };
  }
};
