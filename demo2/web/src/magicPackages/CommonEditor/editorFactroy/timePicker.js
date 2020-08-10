import defaultEditor from './defaultEditor';
import { TimePicker } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = TimePicker;
  source.controlProps = { ...source.controlProps };
  if (source.options && !source.controlProps.options) {
    source.controlProps.options = [...source.options];
  }

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message: '请选择' + source.label
      });
    }
  }

  return defaultEditor(source, props);
}
