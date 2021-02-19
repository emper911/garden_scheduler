import { Light } from '../components/output_components';

export const output_component_mapper = (component) => {
  switch (component.type) {
    case 'light':
      return { type: 'light', component: new Light(component.config) }
    default:
      return { type: null, component: null };
  }
};

