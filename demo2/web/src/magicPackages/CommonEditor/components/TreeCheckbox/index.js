import React, { Component } from 'react';
import { Tree } from 'antd';
import _ from 'lodash';

class TreeCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (checkedKeys, { halfCheckedKeys = [] }) => {
    console.log('checkedKeys', checkedKeys, 'halfCheckedKeys', halfCheckedKeys);
    const { onChange } = this.props;
    if (_.isFunction(onChange)) {
      onChange({
        checkedKeys,
        halfCheckedKeys
      });
    }
  };
  render() {
    const { value = {}, onChange, ...restPorps } = this.props;
    return (
      <Tree
        checkedKeys={_.get(value, 'checkedKeys') || []}
        halfcheckedKeys={_.get(value, 'halfCheckedKeys') || []}
        onCheck={this.handleChange}
        {...restPorps}
      />
    );
  }
}

export default TreeCheckbox;
