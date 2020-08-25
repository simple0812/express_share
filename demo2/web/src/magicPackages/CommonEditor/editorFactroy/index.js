/** 编辑有一定的性能问题 大于50个字段需要谨慎使用*/

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
import draggerUpload from './draggerUpload';
import tree from './tree';
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
    case 'tree':
      ctrl = tree;
      break;
    case 'select':
      ctrl = select;
      break;
    case 'cascader': // 未验证 谨慎使用
      ctrl = cascader;
      break;
    case 'rangePicker':
      ctrl = rangePicker;
      break;
    case 'timePicker': // 未验证 谨慎使用
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
    case 'draggerUpload': // 未验证 谨慎使用
      ctrl = draggerUpload;
      break;
    default:
      ctrl.control = 'input';
      break;
  }

  return ctrl;
}
