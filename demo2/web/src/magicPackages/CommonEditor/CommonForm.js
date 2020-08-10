import React from 'react';
import { Form, Button, message, Row } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import classNames from 'classnames';
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
    editorItems = _.cloneDeep(editorItems);

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

export default Form.create()(CommonForm);
