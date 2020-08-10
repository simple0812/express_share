import React, { Component } from 'react';
import styles from './index.less';
import { Cascader, Button, Icon } from 'antd';

class MulCascader extends Component {
  addItem = () => {
    const value = this.props.value ? this.props.value.concat([{}]) : [{}];
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  deleteItem = (index) => {
    const value = this.props.value ? this.props.value.concat() : [{}];
    value.splice(index, 1);
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  handleChange = (group, index) => {
    const { value = [] } = this.props;
    value[index].groupId = group;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const {
      data = [],
      value = [],
      labelKey = 'groupName',
      valueKey = 'groupId'
    } = this.props;

    function filter(inputValue, path) {
      return path.some((option) => {
        return (
          option[labelKey]
            .toLowerCase()
            .indexOf(String(inputValue).toLowerCase()) > -1
        );
      });
    }
    return (
      <div className={styles.multiCascaderWrapper}>
        {value.map((item, index) => {
          const { groupId = '' } = item;
          return (
            <div className={styles.listWrapper} key={index}>
              <Cascader
                value={groupId}
                onChange={(e) => this.handleChange(e, index)}
                multiple
                changeOnSelect={true}
                fieldNames={{ label: labelKey, value: valueKey }}
                options={data}
                placeholder="请选择"
                showSearch={{ filter }}
              />
              <Icon
                className={styles.closeIcon}
                onClick={(e) => this.deleteItem(index)}
                type="close-circle"
              />
            </div>
          );
        })}
        <Button
          style={{ border: '1px dotted #ccc', width: '100%' }}
          icon="plus"
          onClick={this.addItem}>
          添加
        </Button>
      </div>
    );
  }
}

export default MulCascader;
