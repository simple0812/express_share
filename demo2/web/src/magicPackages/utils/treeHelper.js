import React from 'react';
import { Tree } from 'antd';

import _ from 'lodash';
let TreeNode = Tree.TreeNode;

// 使用数组渲染树
export function renderTreeNodeWithArray(
  nodes,
  parentId,
  { idKey = 'id', pidKey = 'parentId', titleKey = 'title' }
) {
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
  if (_.isEmpty(currNodes)) {
    return '';
  }

  return currNodes.map((each) => (
    <TreeNode value={each[idKey]} title={each[titleKey]} key={each[idKey]}>
      {renderTreeNodeWithArray(each, each[idKey], { idKey, pidKey, titleKey })}
    </TreeNode>
  ));
}

// 使用树渲染树
export function renderTreeNodeWithTreeData(
  nodes,
  { idKey = 'id', titleKey = 'title' }
) {
  if (_.isEmpty(nodes)) {
    return '';
  }
  return nodes.map((each) => (
    <TreeNode value={each[idKey]} title={each[titleKey]} key={each[idKey]}>
      {renderTreeNodeWithTreeData(each.children, { idKey, titleKey })}
    </TreeNode>
  ));
}

export function findFromTreeBy(tree, fn) {
  if (_.isEmpty(tree)) {
    return null;
  }

  // 默认返回第一个元素
  if (!_.isFunction(fn)) {
    fn = () => true;
  }

  let target = null;

  for (let i = 0; i < tree.length; i++) {
    const each = tree[i];
    if (fn(each)) {
      target = each;
      break;
    }

    if (each.children) {
      target = findFromTreeBy(each.children, fn);
      if (target) {
        break;
      }
    }
  }

  return target;
}

export function findLeafsOfTree(tree, leafs, isLeaf) {
  //默认判断是否含有子节点
  if (!_.isFunction(isLeaf)) {
    isLeaf = function (each) {
      return _.isEmpty(each.children);
    };
  }

  leafs = leafs || [];
  if (_.isEmpty(tree)) {
    return leafs;
  }

  for (let i = 0; i < tree.length; i++) {
    const each = tree[i];

    if (isLeaf(each)) {
      leafs.push(each);
    } else {
      findLeafsOfTree(each.children, leafs, isLeaf);
    }
  }

  return leafs;
}

export function findByIdFromTree(tree, id) {
  if (_.isEmpty(tree)) {
    return null;
  }

  let target = null;

  for (let i = 0; i < tree.length; i++) {
    const each = tree[i];
    if (each.id === id) {
      target = each;
      break;
    }

    if (each.children) {
      target = findByIdFromTree(each.children, id);
      if (target) {
        break;
      }
    }
  }

  return target;
}

//xNode当前节点 value 选中的节点 tree 数据源
export function isCompleteChecked(xNode, value, tree, { idKey = 'id' }) {
  if (_.isEmpty(xNode)) {
    return false;
  }

  if (_.isEmpty(xNode.children)) {
    return true;
  }

  if (
    _.every(
      xNode.children,
      (child) =>
        value.indexOf(child[idKey]) >= 0 &&
        isCompleteChecked(child, value, true, { idKey })
    )
  ) {
    return true;
  }

  return false;
}
