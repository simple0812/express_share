import React from 'react';
import { Form, Row, Button } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import searcherFactory from './Searcher';

// 当前页如果含有tabs标签 则在搜索区域不应包含tabs对应的字段 否则会被tabs覆盖
class CombineSearch extends React.Component {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    combineSearchItems: PropTypes.array
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  handleKeyboard = (evt) => {
    // 当前input被focus则 拦截键盘事件 阻止事件冒泡
    // evt.preventDefault();
    evt.stopPropagation();

    switch (evt.keyCode) {
      case 13:
        this.handleSubmit();
        break;
      default:
        break;
    }
  };

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  };

  handleReset = () => {
    this.props.form.resetFields();

    this.handleSubmit();
  };

  getSearchConditions = () => {
    const { combineSearchItems } = this.props;
    var conditions = _.cloneDeep(this.props.form.getFieldsValue());

    _.keys(conditions).forEach((key) => {
      var val = conditions[key];
      let searcherData =
        _.find(combineSearchItems, (each) => each.id === key) || {};
      if (searcherData.control) {
        let searcher = searcherFactory(searcherData.control);
        if (searcher) {
          conditions[key] = searcher.parseValue(val, searcherData, {
            props: this.props,
            conditions,
            key
          });
        }
      }
    });

    let xPrams = _.omitBy(conditions, _.isUndefined);
    return xPrams;
  };

  handleSubmit = () => {
    let xPrams = this.getSearchConditions();

    if (this.props.onSearch) {
      this.props.onSearch(xPrams);
    }
  };

  render() {
    let { combineSearchItems = [], cmdContainerStyle } = this.props;
    combineSearchItems = _.cloneDeep(combineSearchItems);

    return (
      <div
        className={classNames(
          styles.localClass,
          this.props.className,
          'combine-search-container'
        )}>
        <Form className="searchForm" onSubmit={this.handleSubmit}>
          <Row gutter={10} style={{ paddingRight: 5 }}>
            {combineSearchItems.map((source) => {
              source.control = source.control || 'input';
              source.fieldDecorator = source.fieldDecorator || {};

              var searcher = searcherFactory(source.control);
              if (!searcher) return null;

              return searcher.comp(source, this.props);
            })}

            <div
              className="combine-search-cmd-container"
              style={{ ...cmdContainerStyle }}>
              {!_.isEmpty(combineSearchItems) && (
                <Button onClick={this.handleReset} style={{ margin: '0 5px' }}>
                  重置
                </Button>
              )}
              {!_.isEmpty(combineSearchItems) && (
                <Button type="primary" onClick={this.handleSubmit}>
                  搜索
                </Button>
              )}

              {this.props.restButton}
            </div>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CombineSearch);
