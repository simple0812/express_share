/**
 *   
  id: '', // string 编辑字段的Key
  label: '', //string 编辑字段的名称
  control: '', // string or 组件  编辑组件
  controlProps: {}, //object 传递给编辑组件的属性
  required: Boolean, // 是否必填 作为参数传递给form.getFieldDecorator
  renderChildren: () => {}, // fn  动态设置组件的children属性
  checkShow: () => {}, //fn 动态检查是否显示改编辑组件

  getInitialValue: () => {}, //fn 动态获取组件的初始值 作为参数传递给form.getFieldDecorator
  fieldDecorator: {}, // object form.getFieldDecorator的参数
  isWithoutFormItem: Boolean, // 是否使用FormItem包裹

  useCustomItem:Boolean, //是否使用自定的formItem包裹(使用基于col 使用flex布局)
  colFlex: Boolean, // 强制 formItem使用flex布局 方便控制label的宽度
  formItemProps: {} // 设置FormItem的属性

  colSpan: Int, //自定义FormItem 的宽度
  labelStyle:{}, //obj  自定义FormItem label 的样式
  wrapperStyle: {}, //obj自定义FormItem control wrapper 的样式
  renderBefore: () => {}, //fn 编辑组件前面添加自定义内容
  renderAfter: () => {}, //fn 编辑组件后面添加自定义内容

  validate: () => {}, //fn 自定义验证函数 在form.validateFields 的回调函数中会再次验证数据
  convertControlToModel: () => {}, //fn 将编辑组件的值转换成接口需要的格式
  convertModelToControl: () => {}, // fn 将接口数据转换成组件的值

  //check,group, select
  options: [], // 子项数据源
  hasSelectAll: bool, //是否自动添加 ‘全部’ 选项

 * 
 */

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

  // 添加的时候 取init
  if (_.isUndefined(source.fieldDecorator.initialValue)) {
    if (_.isFunction(source.getInitialValue)) {
      source.fieldDecorator.initialValue = source.getInitialValue(props);
    } else if (source.getInitialValue != undefined) {
      source.fieldDecorator.initialValue = source.getInitialValue;
    }
  }

  /**
   * 注: 在编辑的时候 给组件回填值
   * 注：当存在按条件渲染的情况时，会存在字段顺序问题导致渲染失败
   * 如 A、B2个字段 A字段需要根据B是否有值(form.getFieldValue('B'))来决定是否渲染
   * 由于此时B还没调用form.getFieldDecorator() 故没值 导致逻辑错误
   * fixed：在checkShow函数中 使用 form.isFieldTouched 判断是否已经调用from.getFieldDecorator()
   * checkShow: ({ source, props }) => {
          let { form } = props || {};
          return form.isFieldTouched('author')
            ? form.getFieldValue('author')
            : props.model[source.id];
        },
   */
  if (props.isUpdate) {
    let val = props.model[source.id];

    if (_.isFunction(source.convertModelToControl)) {
      val = source.convertModelToControl(props.model[source.id], {
        source,
        props
      });
    }

    source.fieldDecorator.initialValue = val;
  }

  if (_.isFunction(source.renderChildren) && !restControlProps.children) {
    restControlProps.children = source.renderChildren(source, props);
  }

  // 检查组件是否需要渲染
  if (_.isFunction(source.checkShow) && !source.checkShow({ source, props })) {
    return '';
  }

  /* 
    根据key 获取指定字段在form表单里面的值 
    备注：如果key还没有调用getFieldDecorator， 则使用Model对应字段转换后的数据
  */
  source.getValueByKey = (key) => {
    if (!key || !_.isString(key)) {
      return undefined;
    }
    let { form } = props || {};

    let xVal = form.getFieldValue(key);

    if (!form.isFieldTouched(key)) {
      xVal = props.model[source.id];

      if (_.isFunction(source.convertModelToControl)) {
        xVal = source.convertModelToControl(xVal, { source, props });
      }
    }

    return xVal;
  };

  // 没有label
  if (source.isWithoutFormItem) {
    return renderControl({
      source,
      getFieldDecorator,
      style,
      restControlProps,
      props
    });
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
