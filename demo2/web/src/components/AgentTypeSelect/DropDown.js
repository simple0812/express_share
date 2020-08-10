import React, { Component } from 'react';
import { Dropdown, Popover, Tag } from 'antd';
import _ from 'lodash';
import TypeSelect from './index';
import styles from './dropdown.less';

class DropDownSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

    return (
      <div style={{ maxWidth: 300 }}>
        {value.map((each) => (
          <Tag key={each.id} style={{ marginBottom: 5 }}>
            {each.agentType}
          </Tag>
        ))}
      </div>
    );
  };

  handleModalChange = ({ hotLineValue, value } = {}) => {
    const { onChange } = this.props;

    this.setState(
      {
        hotLineValue,
        dropVisible: false
      },
      () => {
        if (_.isFunction(onChange)) {
          onChange(value, hotLineValue);
        }
      }
    );
  };

  handleClose = (item) => {
    const { value, onChange } = this.props;
    let val = _.filter(value, (each) => each.id !== item.id);
    if (_.isFunction(onChange)) {
      onChange(val);
    }
  };

  render() {
    const { value, hotLineValue } = this.props;
    const { popVisible, dropVisible } = this.state;
    return (
      // realStore
      <Dropdown
        visible={dropVisible}
        onVisibleChange={(visible) => this.setState({ dropVisible: visible })}
        overlay={
          <TypeSelect
            onChange={this.handleModalChange}
            onClose={() => this.setState({ dropVisible: false })}
            value={value}
            hotLineValue={hotLineValue || this.state.hotLineValue}
          />
        }
        trigger={['click']}>
        <Popover
          visible={popVisible && !this.props.disabled}
          content={this.renderSelected()}
          title={null}
          onVisibleChange={this.handlePopVisibleChange}>
          <div className={styles.dropdownSelect}>
            <div className="dropdown_select_container">
              <div className="dropdown_select_value">
                {!_.isEmpty(value) &&
                  value.map((each) => (
                    // <div className='' key={each.id}>{each.agentType}</div>
                    <Tag
                      closable
                      onClose={this.handleClose.bind(this, each)}
                      className="value-item"
                      key={each.id}>
                      {each.agentType}
                    </Tag>
                  ))}
              </div>
              {_.isEmpty(value) && (
                <div className="dropdown_select_placeholder">请选择</div>
              )}
            </div>
          </div>
        </Popover>
      </Dropdown>
    );
  }
}

export default DropDownSelect;
