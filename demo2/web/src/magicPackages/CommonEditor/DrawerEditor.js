import React from 'react';
import { Form, Button, message, Drawer, Row, Icon } from 'antd';
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
          {globalLoading.getDetail === 'pending' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
              <Icon type="loading" style={{ fontSize: 30 }} />
            </div>
          ) : (
            <Form>
              <Row>
                {editorItems.map((source) => {
                  source.fieldDecorator = source.fieldDecorator || {};
                  let editorCom = editorFactroy(source.control);

                  return editorCom(source, this.props);
                })}
              </Row>
            </Form>
          )}
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

export default Form.create({
  name: 'drawer_form_' + String(Math.random()).slice(2) // 使用随机数来避免页面出现id相同的组件

  // 完全受控 需要配合onValuesChange 和 onFieldsChange 来使用 逻辑复杂
  // mapPropsToFields(props) {
  //   let { model, editorItems = [] } = props;
  //   console.log('mapPropsToFields', props);

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
})(CommonEditor);
