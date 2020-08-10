import React from 'react';
import _ from 'lodash';
import { Form, Input, Col } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 }
  }
};

function renderControl({
  source,
  getFieldDecorator,
  style,
  restControlProps,
  props
}) {
  return (
    <React.Fragment>
      {_.isFunction(source.renderBefore) &&
        source.renderBefore({
          source,
          getFieldDecorator,
          style,
          restControlProps,
          props
        })}

      {getFieldDecorator(source.id, { ...source.fieldDecorator })(
        React.createElement(source.control || Input, {
          key: source.id,
          style: { width: '100%', ...style },
          ...restControlProps
        })
      )}

      {_.isFunction(source.renderAfter) &&
        source.renderAfter({
          source,
          getFieldDecorator,
          style,
          restControlProps,
          props
        })}
    </React.Fragment>
  );
}

export default function (source, props) {
  const { getFieldDecorator } = props.form;

  // 提供一些快捷属性 方便设置controlProps
  const { disabled, placeholder } = source || {};
  const { style, ...restControlProps } = {
    disabled,
    placeholder,
    ...source.controlProps
  };

  if (_.isEmpty(source.fieldDecorator)) {
    source.fieldDecorator = {};
  }

  if (_.isUndefined(source.fieldDecorator.initialValue)) {
    if (_.isFunction(source.getInitialValue)) {
      source.fieldDecorator.initialValue = source.getInitialValue(props);
    } else if (source.getInitialValue != undefined) {
      source.fieldDecorator.initialValue = source.getInitialValue;
    } else {
      // 编辑的时候需要回显
      if (props.isUpdate) {
        source.fieldDecorator.initialValue = props.model[source.id];
      }
    }
  }

  if (_.isFunction(source.renderChildren) && !restControlProps.children) {
    restControlProps.children = source.renderChildren(source, props);
  }

  // 判断组件是否渲染
  if (_.isFunction(source.checkShow) && !source.checkShow(source, props)) {
    return '';
  }

  // 没有label
  if (source.isWithoutFormItem) {
    return renderControl({
      source,
      getFieldDecorator,
      style,
      restControlProps,
      props
    });
    // return getFieldDecorator(source.id, { ...source.fieldDecorator })(
    //   React.createElement(source.control || Input, {
    //     key: source.id,
    //     style: { width: '100%', ...style },
    //     ...restControlProps
    //   })
    // );
  }

  // 设置自定义的labelcol和wrappercol  优势： 可以占满行以及自定义style
  if (source.useCustomItem) {
    return (
      <Col
        span={source.colSpan || 24}
        key={source.id}
        style={{
          height: 40,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...source.colItemStyle
        }}>
        {source.label && (
          <span
            className="custom-item-label"
            style={{ flexGrow: 0, flexShrink: 0, ...source.labelStyle }}>
            {source.label}：
          </span>
        )}

        <div
          className="custom-item-wrapper"
          style={{ flexGrow: 1, flexShrink: 1, ...source.wrapperStyle }}>
          {renderControl({
            source,
            getFieldDecorator,
            style,
            restControlProps,
            props
          })}
        </div>
      </Col>
    );
  }

  // 使用form的labelcol和wrappercol  优势： 可以快速对齐
  // colFlex: 能够部分模拟customitem 但是不能自定义其他样式 优势：可以使用formitem的验证
  return (
    <Col
      className={source.colFlex ? 'col-flex' : ''}
      span={source.colSpan || 24}
      key={source.id}
      style={{ ...source.colItemStyle }}>
      <FormItem
        label={source.label}
        {...formItemLayout}
        {...source.formItemProps}>
        {renderControl({
          source,
          getFieldDecorator,
          style,
          restControlProps,
          props
        })}
      </FormItem>
    </Col>
  );
}
