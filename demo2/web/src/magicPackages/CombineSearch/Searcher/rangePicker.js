import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

const RangePicker = DatePicker.RangePicker;
export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    var fieldDecorator = {
      ...source.fieldDecorator
    };
    const { style, ...restProps } = source.controlProps;
    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(
          source.id,
          fieldDecorator
        )(
          <RangePicker
            allowClear
            {...restProps}
            style={{ width: '100%', ...style }}
            ranges={{
              今天: [moment().startOf('day'), moment().endOf('day')],
              昨天: [
                moment().startOf('day').subtract(1, 'day'),
                moment().endOf('day').subtract(1, 'day')
              ],
              最近三天: [
                moment().startOf('day').subtract(3, 'day'),
                moment().endOf('day')
              ],
              最近一周: [
                moment().startOf('day').subtract(6, 'day'),
                moment().endOf('day')
              ]
            }}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (
      _.isEmpty(value) ||
      value.length !== 2 ||
      !moment.isMoment(value[0]) ||
      !moment.isMoment(value[1])
    ) {
      return value;
    }

    let startKey = 'startTime';
    let endKey = 'endTime';

    if (searcherData && searcherData.startKey && searcherData.endKey) {
      startKey = searcherData.startKey;
      endKey = searcherData.endKey;
    }

    value = value.map((each, index) => {
      if (_.isFunction(searcherData.convertToSearchFormat)) {
        return searcherData.convertToSearchFormat(
          each,
          index === 0 ? startKey : endKey
        );
      }
      return each.format(
        searcherData.controlProps.format || 'YYYY-MM-DD HH:mm:ss'
      );
    });

    conditions[startKey] = value[0];
    conditions[endKey] = value[1];

    // conditions[key] = undefined;
    return undefined;
  }
};
