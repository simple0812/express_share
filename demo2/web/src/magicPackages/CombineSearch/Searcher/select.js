import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    const { style, ...restControlProps } = source.controlProps || {};

    source.selectOptions = source.selectOptions || [];
    if (_.isFunction(source.selectOptions)) {
      source.selectOptions = source.selectOptions();
    }

    if (!_.isArray(source.selectOptions)) {
      source.selectOptions = _.keys(source.selectOptions).map((xkey) => ({
        value: xkey,
        label: source.selectOptions[xkey]
      }));
    }

    const xValues = source.selectOptions.map((each) => each.value);

    let opt = {
      //监听当前控件的修改
      getValueFromEvent: (values) => {
        let prvValue = this.props.form.getFieldsValue()[source.id];
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
      }
    };

    let { initialValue, ...restFieldDecorator } = source.fieldDecorator || {};

    // 当使用多选模式的时候 需要重新定义"全部"交互
    if (restControlProps.mode !== 'multiple') {
      opt = {};
    } else {
      if (_.isUndefined(initialValue)) {
        initialValue = [];
      }
    }

    let decoratorObj = {
      ...opt,
      ...restFieldDecorator
    };

    if (!_.isUndefined(initialValue)) {
      decoratorObj.initialValue = initialValue;
    }

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(
          source.id,
          decoratorObj
        )(
          <Select
            optionFilterProp="children"
            dropdownStyle={{ fontSize: '12px' }}
            style={{ width: '100%', ...style }}
            allowClear
            placeholder="请选择"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            {...restControlProps}>
            {source.showAllOption && (
              <Select.Option key="nil" value="nil">
                全部
              </Select.Option>
            )}

            {_.map(source.selectOptions, (opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isArray(value)) {
      value = _.filter(value, (each) => each !== 'nil');
    }

    if (value === 'nil') {
      value = undefined;
    }
    if (_.isFunction(searcherData.convertToSearchFormat)) {
      return searcherData.convertToSearchFormat(value);
    }

    return value;
  }
};
