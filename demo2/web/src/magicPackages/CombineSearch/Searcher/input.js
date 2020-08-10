import React from 'react';
import { Input } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;

    const { style, ...restControlProps } = source.controlProps || {};

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(source.id, { ...source.fieldDecorator })(
          <Input
            style={{ width: '100%', ...style }}
            autoComplete="off"
            allowClear
            {...restControlProps}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isFunction(searcherData.dataFormat)) {
      return searcherData.dataFormat(value);
    }

    return value;
  }
};
