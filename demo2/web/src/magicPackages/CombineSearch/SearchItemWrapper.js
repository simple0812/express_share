import React, { Component } from 'react';
import { Col } from 'antd';
import _ from 'lodash';

class SearchItemWrapper extends Component {
  render() {
    const { model = {}, children } = this.props;
    let xStyle = {};
    let controlStyle = {};

    if (_.get(model, 'controlProps.style.width')) {
      xStyle.width = 'auto';
      controlStyle.width = _.get(model, 'controlProps.style.width');
    }

    return (
      <Col
        className="search-item-container"
        xs={24}
        sm={24}
        md={12}
        lg={6}
        xl={6}
        xxl={4}
        style={{ ...xStyle }}>
        {model.label && (
          <span
            className="search-item-label"
            ref={(ref) => (this.labelRef = ref)}
            style={{ ...model.labelStyle }}>
            {model.label}：
          </span>
        )}
        <div className="search-item-control" style={{ ...controlStyle }}>
          {children}
        </div>
      </Col>
    );
  }
}

export default SearchItemWrapper;
