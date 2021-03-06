import React from 'react';
import defaultEditor from './defaultEditor';
import { TreeSelect } from 'antd';
import _ from 'lodash';
import {
  renderTreeNodeWithArray,
  renderTreeNodeWithTreeData
} from '@/magicPackages/utils/treeHelper';
const { TreeNode } = TreeSelect;

export default function (source, props) {
  let idKey = source.idKey || 'id';
  let pidKey = source.parentIdKey || 'parentId';
  let titleKey = source.titleKey || 'title';
  // let isTree = !!source.isTree;

  // 使用数组渲染组件

  source.control = TreeSelect;
  source.controlProps = {
    placeholder: '请选择',
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
      xOptions = [...source.options({ source, props })];
    } else {
      xOptions = [...source.options];
    }

    source.controlProps.children = renderTreeNodeWithTreeData(xOptions, {
      idKey,
      pidKey,
      titleKey
    });

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
      return (val || []).filter((each) => each !== 'nil');
    };
  }

  return defaultEditor(source, props);
}
