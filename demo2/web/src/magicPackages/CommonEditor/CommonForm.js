import React from 'react';
import { Form, Button, message, Row } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import PropTypes from 'prop-types';

import editorFactroy from './editorFactroy';
import BaseForm from './BaseForm';

class CommonForm extends BaseForm {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    editorItems: PropTypes.array
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  render() {
    let {
      editorItems = [],
      model = {},
      globalLoading = {},
      isUpdate,
      title,
      style,
      ...restProps
    } = this.props;

    return (
      <Form className={styles.commonEditDrawer}>
        <Row>
          {editorItems.map((source) => {
            source.fieldDecorator = source.fieldDecorator || {};
            let editorCom = editorFactroy(source.control);

            return editorCom(source, this.props);
          })}
        </Row>
      </Form>
    );
  }
}

export default Form.create({
  name: 'common_form_' + String(Math.random()).slice(2) // 使用随机数来避免页面出现id相同的组件
  // 完全受控 需要配合onValuesChange 和 onFieldsChange 来使用 逻辑复杂
  // mapPropsToFields(props) {
  //   let { model, editorItems = [] } = props;
  //   let ret = {};

  //   if (_.isEmpty(editorItems)) {
  //     return {};
  //   }

  //   editorItems.forEach((item) => {
  //     let key = item.id;
  //     let val = model[key];

  //     if (_.isFunction(item.convertModelToControl)) {
  //       val = item.convertModelToControl(val, { source: item, props });
  //     }

  //     ret[key] = Form.createFormField({
  //       value: val
  //     });
  //   });

  //   return ret;
  // }
})(CommonForm);
