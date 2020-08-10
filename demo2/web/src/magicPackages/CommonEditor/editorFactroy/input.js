import defaultEditor from './defaultEditor';
import _ from 'lodash';
import { Input } from 'antd';

export default function (source, props) {
  source.control = Input;
  source.controlProps = {
    autoComplete: 'off',
    allowClear: true,
    placeholder: source.placeholder || '请输入' + source.label,
    ...source.controlProps
  };

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message: '请输入' + source.label
      });
    }
  }
  return defaultEditor(source, props);
}
