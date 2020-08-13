import React from 'react';
import { DatePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import SearchItemWrapper from '../SearchItemWrapper';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;

    var fieldDecorator = {
      ...source.fieldDecorator
    };

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(
          source.id,
          fieldDecorator
        )(
          <DatePicker
            format="YYYY-MM-DD"
            allowClear
            {...source.controlProps}
            style={{ width: '100%' }}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isObject(value) && moment.isMoment(value)) {
      value = value.format(
        searcherData.controlProps.format || 'YYYY-MM-DD HH:mm:ss'
      );
    }

    if (_.isFunction(searcherData.convertToSearchFormat)) {
      return searcherData.convertToSearchFormat(value);
    }

    return value;
  }
};
