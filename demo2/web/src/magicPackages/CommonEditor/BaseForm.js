import React from 'react';
import { Form, Button, message, Row } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class BaseForm extends React.Component {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    editorItems: PropTypes.array
  };

  static defaultProps = {};

  getSearchConditions = () => {
    const { editorItems } = this.props;
    var conditions = _.cloneDeep(this.props.form.getFieldsValue());

    _.keys(conditions).forEach((key) => {
      var val = conditions[key];
      let searcherData = _.find(editorItems, (each) => each.id === key) || {};
      if (_.isFunction(searcherData.parseValue)) {
        conditions[key] = searcherData.parseValue(val, searcherData, {
          props: this.props,
          conditions,
          key
        });
      }
    });

    let xPrams = _.omitBy(conditions, _.isUndefined);
    return xPrams;
  };

  validateConditions = () => {
    var conditions = this.props.form.getFieldsValue();
    const { editorItems } = this.props;
    let ret = true;

    _.keys(conditions).forEach((key) => {
      var val = conditions[key];
      let searcherData = _.find(editorItems, (each) => each.id === key) || {};
      if (_.isFunction(searcherData.validate)) {
        let msg = searcherData.validate(val, searcherData, {
          props: this.props,
          conditions,
          key
        });

        if (msg) {
          message.warning(msg);
          ret = false;
          return;
        }
      }
    });

    return ret;
  };

  // 验证数据 成功后触发事件
  handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const { onSave } = this.props;

    try {
      let params = await this.formValidate(e);
      if (!_.isFunction(onSave)) {
        return;
      }

      let promise = onSave(params);

      if (
        promise &&
        _.isFunction(promise.then) &&
        _.isFunction(promise.catch)
      ) {
        await promise;
        this.props.form.resetFields();
      }
    } catch (e) {}
  };

  // 只验证数据 不触发事件
  formValidate = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => {
        // form表单验证有效性
        if (err) {
          reject(new Error(err));
          return;
        }
        // 额外验证参数的有效性
        let errMsg = this.validateConditions();
        if (!errMsg) {
          reject(new Error(errMsg));
          return;
        }
        const { model } = this.props;

        let xParams = this.getSearchConditions();
        let params = { ...model, ...xParams };

        resolve(params);
      });
    });
  };

  handelClose = () => {
    const { onClose } = this.props;
    this.props.form.resetFields();
    if (_.isFunction(onClose)) {
      onClose();
    }
  };
}
