import React from 'react';
import { Tree, Checkbox, Icon } from 'antd';
import styles from './index.less';
import message from '@/components/Message';

const { TreeNode } = Tree;

export default class UserTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      fromSet: [],
      fromUser: [],
      unCheckedTemp: [],
      checkedKeys: []
    };
    this.key = props.key || 'id';
    this.label = props.label || 'name';
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onCheck = (checkedKeys, e) => {
    this.setState({
      checkedKeys
    });
  };

  onUnCheckedTemp = (checked, item) => {
    let keyArr = [String(item[this.key])];
    let loop = (data) =>
      data.map((_item) => {
        keyArr.push(String(_item[this.key]));
        if (_item.children) {
          loop(_item.children);
        }
        return '';
      });
    item.children && loop(item.children);
    const unCheckedTemp = this.state.unCheckedTemp.concat();
    keyArr.map((item) => {
      let index = unCheckedTemp.indexOf(item);
      if (index > -1 && !checked) {
        unCheckedTemp.splice(index, 1);
      } else if (index == -1 && checked) {
        unCheckedTemp.push(item);
      }
      return '';
    });

    this.setState({
      unCheckedTemp
    });
  };

  onAdd = () => {
    const { checkedKeys = [] } = this.state;
    const { dataTree = [] } = this.props;
    let fromSet = [];
    let fromUser = [];
    let flag = false;
    const loop = (dataTree) =>
      dataTree.map((item) => {
        if (checkedKeys.indexOf(String(item[this.key])) > -1) {
          if (item.isUser) {
            if (
              fromUser.map((item) => item[this.key]).indexOf(item[this.key]) >
              -1
            ) {
              flag = true;
              return '';
            }
            fromUser.push(item);
          } else {
            fromSet.push(item);
          }
        } else if (
          checkedKeys.indexOf(String(item[this.key])) == -1 &&
          item.children
        ) {
          loop(item.children);
        }
        return '';
      });
    loop(dataTree);
    if (flag) {
      // message.error('重复人员已合并！')
    }
    this.setState({
      fromSet,
      fromUser
    });
    this.props.onChange && this.props.onChange({ fromSet, fromUser });
  };

  onRemove = () => {
    const { unCheckedTemp, checkedKeys, fromUser, fromSet } = this.state;
    let leaveCheckedKeys = [],
      leaveFromSet = [],
      leaveFromUser = [];

    checkedKeys.forEach((item, index) => {
      if (unCheckedTemp.indexOf(String(item)) == -1) {
        leaveCheckedKeys.push(item);
      }
    });
    fromSet.forEach((item, index) => {
      if (unCheckedTemp.indexOf(String(item[this.key])) == -1) {
        leaveFromSet.push(item);
      }
    });
    fromUser.forEach((item, index) => {
      if (unCheckedTemp.indexOf(String(item[this.key])) == -1) {
        leaveFromUser.push(item);
      }
    });
    this.setState({
      checkedKeys: leaveCheckedKeys,
      unCheckedTemp: [],
      fromSet: leaveFromSet,
      fromUser: leaveFromUser
    });
    this.props.onChange &&
      this.props.onChange({ fromSet: leaveFromSet, fromUser: leaveFromUser });
  };

  render() {
    const { dataTree = [], value = {} } = this.props;
    const { fromSet = [], fromUser = [] } = value;
    const {
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      unCheckedTemp
    } = this.state;
    const loop = (dataTree) =>
      dataTree.map((item) => {
        const title = (
          <span title={item[this.label]} className="treenodeTitle">
            {item.isUser ? (
              <Icon type="user" style={{ fontSize: 12, marginRight: 4 }} />
            ) : null}
            {item[this.label]}
          </span>
        );
        if (item.children) {
          return (
            <TreeNode key={String(item[this.key])} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={String(item[this.key])} title={title} />;
      });
    return (
      <div className={styles.userTreeWrapper}>
        <div className={styles.treeWrapper}>
          <Tree
            checkable
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}>
            {loop(dataTree)}
          </Tree>
        </div>

        <div className={styles.btnWrapper}>
          <div className={styles.btn} onClick={this.onAdd}>
            <Icon
              type="right-circle"
              theme="filled"
              style={{ color: '#fff', marginRight: 6 }}
            />
            添加
          </div>
          <div className={styles.btn} onClick={this.onRemove}>
            移除
            <Icon
              type="left-circle"
              theme="filled"
              style={{ color: '#fff', marginLeft: 6 }}
            />
          </div>
        </div>

        <div className={styles.selectedWrapper}>
          <div className={styles.selectedItems}>
            {fromSet
              .concat(Array.from(new Set(fromUser)))
              .map((item, index) => {
                return (
                  <Checkbox
                    checked={unCheckedTemp.indexOf(String(item[this.key])) > -1}
                    key={index}
                    onChange={(e) =>
                      this.onUnCheckedTemp(e.target.checked, item)
                    }>
                    {item[this.label] || ''}
                  </Checkbox>
                );
              })}
          </div>
          <div className={styles.countWrapper}>
            共计
            <span className={styles.count}>
              {fromSet.concat(Array.from(new Set(fromUser))).length}{' '}
            </span>
            项
          </div>
        </div>
      </div>
    );
  }
}
