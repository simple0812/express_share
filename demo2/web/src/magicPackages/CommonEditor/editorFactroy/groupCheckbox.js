import defaultEditor from './defaultEditor';
import { Checkbox } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = Checkbox.Group;
  source.controlProps = { ...source.controlProps };
  if (source.options && !source.controlProps.options) {
    let xOptions = [];

    if (_.isFunction(source.options)) {
      xOptions = [...source.options({ source, props })];
    } else {
      xOptions = [...source.options];
    }

    source.controlProps.options = [...xOptions];

    if (source.hasSelectAll) {
      source.controlProps.options.unshift({
        label: '全部',
        value: 'nil'
      });

      source.fieldDecorator = source.fieldDecorator || {};
      const xValues = xOptions.map((each) => each.value);
      source.fieldDecorator.getValueFromEvent = (values) => {
        console.log('getValueFromEvent', values);
        let prvValue = props.form.getFieldsValue()[source.id];
        if (!_.isArray(prvValue)) {
          prvValue = [prvValue];
        }

        const newAddVal = _.xor(values, prvValue);

        let newVal = values;
        if (values.length >= prvValue.length) {
          // 如果是添加新项
          // 如果点击的是全部 则选择所有
          if (newAddVal.indexOf('nil') >= 0) {
            newVal = xValues.concat(['nil']);
          } else {
            newVal = _.filter(values, (each) => each !== 'nil');

            // 如果已经全选 则添加上 ‘全部’
            if (xValues.length === _.get(newVal, 'length', 0)) {
              newVal.push('nil');
            }
          }
        } else {
          // 如果是反选 则移除全部

          // 如果点击的是全部 则清空所有
          if (newAddVal.indexOf('nil') >= 0) {
            newVal = [];
          } else {
            newVal = _.filter(values, (each) => each !== 'nil');
          }
        }

        return newVal;
      };

      // 备注: 会触发2次, 故不使用改方法
      // source.fieldDecorator.normalize = (value, prevValue = []) => {
      //   console.log('normalize', value)

      //   return value;
      //   // // 点击all 全选
      //   // if (value.indexOf('nil') >= 0 && prevValue.indexOf('nil') < 0) {
      //   //   return source.options.map((each) => each.value).concat('nil');
      //   // }
      //   // // 点击all  反选
      //   // if (value.indexOf('nil') < 0 && prevValue.indexOf('nil') >= 0) {
      //   //   return [];
      //   // }

      //   // // 选择子项
      //   // if (prevValue.length < value.length) {
      //   //   return value;
      //   // } else {
      //   //   // 反选子项  同时反选"all"
      //   //   return value//.filter((each) => each !== 'nil');
      //   // }

      //   // if (value.length === source.options)
      // };
    }
  }

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message: '请选择' + source.label
      });
    }
  }

  return defaultEditor(source, props);
}
