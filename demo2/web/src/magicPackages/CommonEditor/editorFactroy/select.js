import React from 'react';
import defaultEditor from './defaultEditor';
import { Select } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = Select;
  source.controlProps = {
    placeholder: '请选择',
    allowClear: true,
    getPopupContainer: (node) => node,
    ...source.controlProps
  };
  if (
    source.options &&
    !_.isFunction(source.renderChildren) &&
    !source.controlProps.children
  ) {
    source.controlProps.children = [...source.options].map((each) => (
      <Select.Option key={each.key} value={each.key}>
        {each.label}
      </Select.Option>
    ));
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
