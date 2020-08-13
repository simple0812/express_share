import React from 'react';
import { TreeSelect } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

// 未验证 使用的时候需要测试下
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

    let { ...restFieldDecorator } = source.fieldDecorator || {};

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(source.id, { ...restFieldDecorator })(
          <TreeSelect
            showSearch
            style={{ width: '100%', ...style }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            allowClear
            multiple
            treeDefaultExpandAll
            treeNodeFilterProp="label"
            onChange={this.onChange}
            {...restControlProps}></TreeSelect>
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isArray(value)) {
      value = _.filter(value, (each) => each !== 'nil');
    }

    if (_.isFunction(searcherData.convertToSearchFormat)) {
      return searcherData.convertToSearchFormat(value);
    }

    return value;
  }
};
