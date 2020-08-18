import defaultEditor from './defaultEditor';
import inputEditor from './input';
import select from './select';
import textarea from './textarea';
import checkboxGroup from './groupCheckbox';
import radioGroup from './groupRadio';
import rangePicker from './rangePicker';
import timePicker from './timePicker';
import cascader from './cascader';
import treeSelect from './treeSelect';
import _ from 'lodash';

export default function editorFactroy(type = 'input') {
  if (_.isObject(type)) {
    return defaultEditor;
  }

  var ctrl = defaultEditor;
  switch (type) {
    case 'input':
      ctrl = inputEditor;
      break;
    case 'select':
      ctrl = select;
      break;
    case 'cascader':
      ctrl = cascader;
      break;
    case 'rangePicker':
      ctrl = rangePicker;
      break;
    case 'timePicker':
      ctrl = timePicker;
      break;
    case 'textarea':
      ctrl = textarea;
      break;
    case 'checkbox':
      ctrl = checkboxGroup;
      break;
    case 'radio':
      ctrl = radioGroup;
      break;
    case 'treeSelect':
      ctrl = treeSelect;
      break;
    default:
      ctrl.control = 'input';
      break;
  }

  return ctrl;
}
