import React from 'react';
import defaultEditor from './defaultEditor';
import TreeCheckbox from '../components/TreeCheckbox';
import _ from 'lodash';
import {
  renderTreeNodeWithArray,
  renderTreeNodeWithTreeData,
  findFromTreeBy,
  isCompleteChecked
} from '@/magicPackages/utils/treeHelper';

// 注意：目前只支持树状结构的数据 (全选、半选回填需要遍历数据 目前不支持数组结构)
export default function (source, props) {
  let idKey = source.idKey || 'id';
  let pidKey = source.parentIdKey || 'parentId';
  let titleKey = source.titleKey || 'title';
  // let isTree = !!source.isTree;

  source.control = TreeCheckbox;
  source.controlProps = {
    placeholder: '请选择',
    checkable: true,
    getPopupContainer: (node) => node,
    ...source.controlProps
  };
  if (
    source.options &&
    !_.isFunction(source.renderChildren) &&
    !source.controlProps.children
  ) {
    let xOptions = [];

    if (_.isFunction(source.options)) {
      xOptions = source.options({ source, props }) || [];
    } else {
      xOptions = [...source.options];
    }

    // source.controlProps.children = isTree
    //   ? renderTreeNodeWithTreeData(xOptions, {
    //       idKey,
    //       pidKey,
    //       titleKey
    //     })
    //   : renderTreeNodeWithArray(xOptions, null, {
    //       idKey,
    //       pidKey,
    //       titleKey
    //     });

    source.controlProps.children = renderTreeNodeWithTreeData(xOptions, {
      idKey,
      pidKey,
      titleKey
    });
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

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      if (_.isEmpty(val)) {
        return undefined;
      }
      return (val.checkedKeys || []).concat(val.halfCheckedKeys || []);
    };
  }

  // 需要判断把val数据分解为 全选和半选
  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      if (_.isString(val)) {
        val = val.split(',');
      }

      if (_.isEmpty(val) || !_.isArray(val)) {
        return undefined;
      }
      let checkedKeys = [];
      let halfCheckedKeys = [];
      let xOptions = [];

      if (_.isFunction(source.options)) {
        xOptions = [...source.options({ source, props })];
      } else {
        xOptions = [...source.options];
      }

      val.forEach((each) => {
        let xItem = findFromTreeBy(xOptions, (item) => item[idKey] === each);
        if (isCompleteChecked(xItem, val, xOptions, { idKey })) {
          checkedKeys.push(each);
        } else {
          halfCheckedKeys.push(each);
        }
      });

      return {
        checkedKeys,
        halfCheckedKeys
      };
    };
  }

  return defaultEditor(source, props);
}
