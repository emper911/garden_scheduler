import { Light } from '../components/output_components';

export const output_component_mapper = (component) => {
  switch (component.type) {
    case 'light':
      return { id: component.id, type: 'light', component: new Light(component.config) }
    default:
      return { id: null, type: null, component: null };
  }
};

