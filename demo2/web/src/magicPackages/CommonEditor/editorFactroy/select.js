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
    let xOptions = [];

    if (_.isFunction(source.options)) {
      xOptions = [...source.options({ source, props })];
    } else {
      xOptions = [...source.options];
    }

    if (_.isArray(xOptions)) {
      if (source.hasSelectAll) {
        xOptions.unshift({
          label: '全部',
          key: 'nil'
        });

        source.controlProps = source.controlProps || {};
        source.fieldDecorator = source.fieldDecorator || {};
        source.controlProps.mode = 'multiple';
        const xValues = xOptions.map((each) => each.key);
        source.fieldDecorator.getValueFromEvent = (values) => {
          let prvValue = props.form.getFieldsValue()[source.id];
          if (!_.isArray(prvValue)) {
            prvValue = [prvValue];
          }

          const newAddVal = _.xor(values, prvValue);

          let newVal = values;
          if (values.length >= prvValue.length) {
            // 如果是添加新项
            // 如果点击的是全部 则选择所有
            if (newAddVal.indexOf('nil') >= 0) {
              newVal = xValues.concat(['nil']);
            } else {
              newVal = _.filter(values, (each) => each !== 'nil');

              // 如果已经全选 则添加上 ‘全部’
              if (xValues.length === _.get(newVal, 'length', 0)) {
                newVal.push('nil');
              }
            }
          } else {
            // 如果是反选 则移除全部

            // 如果点击的是全部 则清空所有
            if (newAddVal.indexOf('nil') >= 0) {
              newVal = [];
            } else {
              newVal = _.filter(values, (each) => each !== 'nil');
            }
          }

          return newVal;
        };
      }
      source.controlProps.children = [...xOptions].map((each) => (
        <Select.Option key={each.key} value={each.key}>
          {each.label}
        </Select.Option>
      ));
    }
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

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      if (_.isEmpty(val)) {
        return undefined;
      }
      return (val || []).filter((each) => each !== 'nil');
    };
  }

  return defaultEditor(source, props);
}
