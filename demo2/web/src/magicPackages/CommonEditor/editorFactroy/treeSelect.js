import React from 'react';
import defaultEditor from './defaultEditor';
import { TreeSelect } from 'antd';
import _ from 'lodash';
const { TreeNode } = TreeSelect;

export default function (source, props) {
  let idKey = source.idKey || 'id';
  let pidKey = source.idKey || 'parentId';
  let titleKey = source.idKey || 'title';
  let isTree = !!source.isTree;

  // 使用数组渲染组件
  function renderTreeNodeWithArray(nodes, parentId) {
    if (_.isEmpty(nodes)) {
      return '';
    }
    let currNodes = [];
    // 第一层
    if (_.isUndefined(parentId)) {
      currNodes = nodes.filter((each) => !each.parentId);
    } else {
      currNodes = nodes.filter((each) => each[pidKey] === parentId);
    }
    if (_.isEmpty(nodes)) {
      return '';
    }

    return currNodes.map((each) => (
      <TreeNode value={each[idKey]} title={each[titleKey]} key={each[idKey]}>
        {renderTreeNodeWithArray(each, each[idKey])}
      </TreeNode>
    ));
  }

  // 使用树渲染组件
  function renderTreeNodeWithTreeData(nodes) {
    if (_.isEmpty(nodes)) {
      return '';
    }
    return nodes.map((each) => (
      <TreeNode value={each[idKey]} title={each[titleKey]} key={each[idKey]}>
        {renderTreeNodeWithTreeData(each.children)}
      </TreeNode>
    ));
  }

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
    source.controlProps.children = isTree
      ? renderTreeNodeWithTreeData(source.options)
      : renderTreeNodeWithArray(source.options);
  }

  // else if (_.isFunction(getOptions)) {
  //   let xOptions = getOptions(source, props);
  //   source.controlProps.children = isTree
  //     ? renderTreeNodeWithTreeData(xOptions)
  //     : renderTreeNodeWithArray(xOptions);
  // }

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
