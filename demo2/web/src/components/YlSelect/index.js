import React, { Component } from 'react';
import { Select, Popover, Tag } from 'antd';
import _ from 'lodash';
import Styles from './index.less';

class YlSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popVisible: false
    };
  }

  handleVisibleChange = (visible) => {
    this.setState({
      popVisible: false
    });
  };

  handlePopVisibleChange = (val) => {
    this.setState({
      popVisible: val
    });
  };

  renderSelected = () => {
    const { value } = this.props;

    if (_.isEmpty(value) || (value.length === 1 && value[0] == 'nil')) {
      return '暂未选择内容';
    }

    let temp = [];

    this.props.children.forEach((each) => {
      let index = _.findIndex(value, (item) => {
        if (_.isObject(item)) {
          return String(item.key) === String(_.get(each, 'props.value', ''));
        } else {
          return String(item) === String(_.get(each, 'props.value', ''));
        }
      });

      if (index >= 0) {
        temp.push(each.props);
      }
    });

    return (
      <div style={{ maxWidth: 300 }}>
        {temp.map((each) => (
          <Tag key={each.value} style={{ marginBottom: 5 }}>
            {each.children}
          </Tag>
        ))}
      </div>
    );
  };

  handleChange = (val, evt) => {
    const { onChange, showAll, value, children } = this.props;
    let xValues = _.map(children || [], (each) => {
      return _.get(each, 'props.value');
    });

    if (!_.isFunction(onChange)) {
      return;
    }

    if (!showAll) {
      return onChange(val);
    }

    const newAddVal = _.xor(val, value);
    let newVal = val;

    if (_.get(val, 'length', 0) >= _.get(value, 'length', 0)) {
      // 如果是添加新项
      // 如果点击的是全部 则选择所有
      if (newAddVal.indexOf('nil') >= 0) {
        newVal = xValues.concat(['nil']);
      } else {
        newVal = _.filter(val, (each) => each !== 'nil');

        // 如果已经全选 则添加上 ‘全部’
        if (xValues.length === _.get(newVal, 'length', 0)) {
          newVal.push('nil');
        }
      }
    } else {
      // 如果是反选

      // 如果点击的是全部 则清空所有
      if (newAddVal.indexOf('nil') >= 0) {
        newVal = [];
      } else {
        newVal = _.filter(val, (each) => each !== 'nil');
      }
    }

    onChange(newVal);
  };
  render() {
    const { popVisible } = this.state;
    const {
      showAll,
      children,
      onChange,
      getPopupContainer,
      ...restProps
    } = this.props;
    return (
      <Popover
        getPopupContainer={getPopupContainer}
        visible={popVisible && !this.props.disabled}
        content={this.renderSelected()}
        title={null}
        onVisibleChange={this.handlePopVisibleChange}>
        <Select
          className={Styles.ylSelect}
          getPopupContainer={getPopupContainer}
          {...restProps}
          onChange={this.handleChange}
          onDropdownVisibleChange={this.handleVisibleChange}>
          {showAll && <Select.Option value="nil">全部</Select.Option>}
          {children}
        </Select>
      </Popover>
    );
  }
}

export default YlSelect;
