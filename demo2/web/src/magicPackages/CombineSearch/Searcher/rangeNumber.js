import React, { Component } from 'react';
import { InputNumber } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    const { style, ...restControlProps } = source.controlProps || {};

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(
          source.id,
          source.fieldDecorator
        )(
          <RangerNumber
            style={{ width: '100%', ...style }}
            {...restControlProps}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isEmpty(value)) {
      return value;
    }

    let minKey = `min${key}`;
    let maxKey = `max${key}`;

    if (searcherData && searcherData.minKey && searcherData.maxKey) {
      minKey = searcherData.minKey;
      maxKey = searcherData.maxKey;
    }

    // 如果min > max
    if (!_.isUndefined(value.min) && !_.isUndefined(value.max)) {
      if (+value.min > +value.max) {
        [value.min, value.max] = [value.max, value.min];
      }

      if (props && props.form && props.form.setFieldsValue) {
        props.form.setFieldsValue({
          [key]: value
        });
      }
    }

    conditions[minKey] = value.min;
    conditions[maxKey] = value.max;

    // conditions[key] = undefined;
    return undefined;
    // return value;
  }
};

class RangerNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangeByKey = (key, val, evt) => {
    const { value = {}, onChange } = this.props;
    value[key] = val;

    if (_.isFunction(onChange)) {
      onChange(value);
    }
  };

  render() {
    const {
      value: { min, max } = {},
      style,
      onChange,
      ...restProps
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...style
        }}
        {...restProps}>
        <InputNumber
          value={min}
          precision={2}
          min={0}
          style={{ flex: '1 1' }}
          max={100}
          onChange={this.handleChangeByKey.bind(this, 'min')}
        />
        <span>-</span>
        <InputNumber
          value={max}
          min={0}
          max={100}
          allowClear
          style={{ flex: '1 1' }}
          precision={2}
          onChange={this.handleChangeByKey.bind(this, 'max')}
        />
      </div>
    );
  }
}
