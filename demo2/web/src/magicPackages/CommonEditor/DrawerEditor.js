import React from 'react';
import { Form, Button, message, Drawer, Row } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseForm from './BaseForm';

import editorFactroy from './editorFactroy';

class CommonEditor extends BaseForm {
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
      onSave,
      pageTitle,
      isReadonly,
      ...restProps
    } = this.props;
    editorItems = _.cloneDeep(editorItems);
    let submitLoading = globalLoading.create;

    if (isUpdate) {
      submitLoading = globalLoading.update;
    }

    return (
      <Drawer
        title={title}
        width={600}
        placement="right"
        onClose={this.handelClose.bind(this, null)}
        maskClosable={false}
        destroyOnClose={true}
        visible={this.props.visible}
        style={{
          overflow: 'auto',
          paddingBottom: 53,
          ...style
        }}
        className={classNames(styles.commonEditDrawer, this.props.className)}
        {...restProps}>
        <div className="draw-content">
          <Form>
            <Row>
              {editorItems.map((source) => {
                // source.control = source.control;
                source.fieldDecorator = source.fieldDecorator || {};
                let editorCom = editorFactroy(source.control);

                return editorCom(source, this.props);
              })}
            </Row>
          </Form>
        </div>
        <div className="draw-footer">
          <Button
            onClick={this.handelClose.bind(this, null)}
            style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            disabled={isReadonly}
            loading={submitLoading === 'pending'}
            type="primary"
            onClick={this.handleSubmit}>
            保存
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default Form.create()(CommonEditor);
