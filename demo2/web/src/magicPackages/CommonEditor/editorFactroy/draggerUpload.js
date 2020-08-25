import defaultEditor from './defaultEditor';
import _ from 'lodash';
import DraggerUpload from '../components/DraggerUpload';

export default function (source, props) {
  source.control = DraggerUpload;
  source.controlProps = {
    ...source.controlProps
  };

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
