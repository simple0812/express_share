import React from 'react';
import { Tree, Input, Icon, Popconfirm } from 'antd';
import message from '@/components/Message';
import styles from './index.less';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

const { TreeNode } = Tree;
const { Search } = Input;

@inject('userStore')
@observer
export default class GroupTree extends React.Component {
  constructor(props) {
    super(props);
    this.dragToNodeId = '';
    this.dragStartNodeId = '';
    this.state = {
      search: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      selectedKeys: [],
      selectedNode: '',
      selectedPos: '',
      drag: false,
      editName: '',
      addName: '',
      defaultSelectedKeys: undefined,
      submitDisabled: false
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { currentGroup = {}, initFlag, resetInitFlag } = nextProps.userStore;
    //默认初选中第一个群组
    if (initFlag) {
      state.selectedKeys = [String(currentGroup.groupId)];
      state.selectedNode = currentGroup;
      state.selectedPos = '0-0';
      resetInitFlag();
      return state;
    }
    return null;
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onChange = (e) => {
    const { value } = e.target;
    const { groupList = [] } = this.props.userStore;
    const expandedKeys = toJS(groupList)
      .map((item) => {
        if (String(item.groupName).indexOf(value) > -1) {
          return String(item.groupParentId);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    });
  };

  onSelect = (selectedKeys, e) => {
    if (
      this.state.status === 'add' ||
      this.state.status === 'edit' ||
      this.state.status === 'delete'
    ) {
      return;
    }
    const { selectedNode } = this.state;
    const { setCurrentGroup } = this.props.userStore;
    let newSelectedNode =
      (e.node && e.node.props && e.node.props.dataRef) || '';
    if (newSelectedNode.groupId == 'temp') {
      return;
    }
    if (selectedNode.groupId === newSelectedNode.groupId) {
      newSelectedNode = '';
    }
    setCurrentGroup(newSelectedNode);
    this.setState({
      selectedKeys,
      selectedNode: newSelectedNode,
      selectedPos: e.node && e.node.props && e.node.props.pos
    });
  };

  onEdit = () => {
    const { selectedNode, status } = this.state;
    if (status == 'add') {
      this.props.userStore.getGroupTree();
    }
    if (!selectedNode) {
      message.error('请先选择群组！');
      return;
    }
    this.setState({
      editName: selectedNode.groupName,
      status: status === 'edit' ? '' : 'edit'
    });
  };

  handleEdit = () => {
    if (this.state.submitDisabled) {
      return;
    }
    if (
      !this.state.editName ||
      (this.state.editName && !this.state.editName.trim())
    ) {
      message.error('群组名称不可为空！');
      return;
    } else if (this.state.editName.length > 30) {
      message.error('群组名称不可超过30个字符！');
      return;
    }
    this.setState({
      submitDisabled: true
    });
    this.props.userStore
      .updateGroup(this.state.selectedNode.groupId, this.state.editName)
      .then((rs) => {
        if (rs.success) {
          message.success('编辑成功！');
          this.props.userStore.getGroupTree();
          this.setState({
            status: '',
            editName: '',
            submitDisabled: false
          });
        }
      })
      .catch(() => this.setState({ submitDisabled: false }));
  };

  onCancelEdit = () => {
    this.setState({
      status: '',
      editName: ''
    });
  };

  onAddChild = () => {
    if (this.state.status == 'add') {
      return;
    }
    const { dataTree = [] } = this.props;
    const { selectedNode, selectedPos, status, expandedKeys = [] } = this.state;
    let parentData = dataTree;
    if (selectedNode) {
      let arr = selectedPos.split('-');
      arr.forEach((item, index) => {
        if (index === 0 && arr.length == 2) {
          parentData = dataTree;
        } else if (index !== 0) {
          if (parentData[item].children) {
            parentData = parentData[item].children;
          } else {
            parentData[item].children = [];
            parentData = parentData[item].children;
          }
        }
      });
    }
    parentData.push({
      groupId: 'temp',
      flag: 'temp',
      groupName: ''
    });

    let newExpandedKeys = expandedKeys.concat();

    if (newExpandedKeys.indexOf(String(selectedNode.groupId)) == -1) {
      newExpandedKeys.push(String(selectedNode.groupId));
    }
    this.setState({
      status: status === 'add' ? '' : 'add',
      expandedKeys: newExpandedKeys
    });
  };

  handleAdd = () => {
    const { selectedNode, addName, submitDisabled } = this.state;
    if (submitDisabled) {
      return;
    }
    if (!addName || (addName && !addName.trim())) {
      message.error('群组名称不可为空！');
      return;
    } else if (addName.length > 30) {
      message.error('群组名称不可超过30个字符！');
      return;
    }
    this.setState({
      submitDisabled: true
    });
    this.props.userStore
      .addGroup(selectedNode.groupId, addName)
      .then((rs) => {
        if (rs.success) {
          message.success('群组创建成功！');
          this.props.userStore.getGroupTree();
          this.setState({
            status: '',
            addName: '',
            submitDisabled: false
          });
        }
      })
      .catch(() => this.setState({ submitDisabled: false }));
  };

  onCancelAdd = () => {
    this.setState({
      status: '',
      addName: ''
    });
    this.props.userStore.getGroupTree();
  };

  onMove = () => {
    const { status } = this.state;
    this.setState({
      status: status === 'move' ? '' : 'move'
    });
  };

  onDelete = () => {
    const { selectedNode, status } = this.state;
    if (!selectedNode) {
      message.error('请先选择群组！');
      return;
    }
    this.setState({
      status: status === 'delete' ? '' : 'delete'
    });
  };

  handleDelete = () => {
    const { selectedNode } = this.state;
    const { userStore = {} } = this.props;
    const { setCurrentGroup, deleteGroup } = userStore;
    deleteGroup(selectedNode.groupId).then((rs) => {
      if (rs.success) {
        message.success('群组删除成功！');
        this.setState(
          {
            status: '',
            selectedKeys: []
          },
          () => setCurrentGroup()
        );
        setTimeout(() => {
          this.props.userStore.getGroupTree(true);
        });
      }
    });
  };

  cancelDelete = () => {
    this.setState({
      status: ''
    });
  };

  onDragEnter = (e) => {
    this.dragToNodeId = e.node.props.eventKey;
  };

  onDragEnd = (e) => {
    this.dragStartNodeId = e.node.props.eventKey;
    const { moveGroup } = this.props.userStore;
    if (this.dragToNodeId == undefined) {
      message.error('请选择要移入的分组！');
      return;
    }
    moveGroup(this.dragStartNodeId, this.dragToNodeId).then((rs) => {
      if (rs.success) {
        message.success('群组移动成功！');
        this.props.userStore.getGroupTree();
      }
    });
  };

  render() {
    const { dataTree = [] } = this.props;
    const {
      search,
      selectedKeys,
      addName,
      searchValue,
      expandedKeys,
      autoExpandParent,
      status,
      editName
    } = this.state;
    const loop = (dataTree) =>
      dataTree.map((item) => {
        const index = item.groupName.indexOf(searchValue);
        const beforeStr = item.groupName.substr(0, index);
        const afterStr = item.groupName.substr(index + searchValue.length);
        let title;
        if (item.groupId === 'temp') {
          title = (
            <span title={item.groupName} className="treenodeTitle">
              <Icon
                type="folder"
                style={{ color: 'rgba(0,0,0,0.85)', marginRight: 4 }}
              />
              {status === 'add' && (
                <span>
                  <Input
                    onChange={(e) => this.setState({ addName: e.target.value })}
                    value={addName}
                    style={{
                      verticalAlign: 'top',
                      height: 24,
                      marginLeft: 8,
                      width: 'calc(100% - 78px)'
                    }}
                    autoFocus="autofocus"
                    ref="input"
                  />
                  <Icon
                    onClick={this.onCancelAdd}
                    type="close-circle"
                    theme="filled"
                    style={{
                      marginTop: 2,
                      color: '#E55A5A',
                      fontSize: 20,
                      marginLeft: 6
                    }}
                  />
                  <Icon
                    onClick={this.handleAdd}
                    type="check-circle"
                    theme="filled"
                    style={{
                      marginTop: 2,
                      color: '#297FD9',
                      fontSize: 20,
                      marginLeft: 6
                    }}
                  />
                </span>
              )}
            </span>
          );
        } else if (selectedKeys[0] == item.groupId && status === 'edit') {
          title = (
            <span title={item.groupName} className="treenodeTitle">
              <Icon
                type="folder"
                style={{ color: 'rgba(0,0,0,0.85)', marginRight: 4 }}
              />
              {status === 'edit' && (
                <span>
                  <Input
                    onChange={(e) =>
                      this.setState({ editName: e.target.value })
                    }
                    value={editName}
                    style={{
                      verticalAlign: 'top',
                      height: 24,
                      marginLeft: 8,
                      width: 'calc(100% - 78px)'
                    }}
                    autoFocus="autofocus"
                    ref="input"
                  />
                  <Icon
                    onClick={this.onCancelEdit}
                    type="close-circle"
                    theme="filled"
                    style={{
                      marginTop: 2,
                      color: '#E55A5A',
                      fontSize: 20,
                      marginLeft: 6
                    }}
                  />
                  <Icon
                    onClick={this.handleEdit}
                    type="check-circle"
                    theme="filled"
                    style={{
                      marginTop: 2,
                      color: '#297FD9',
                      fontSize: 20,
                      marginLeft: 6
                    }}
                  />
                </span>
              )}
            </span>
          );
        } else {
          title =
            index > -1 ? (
              <span title={item.groupName} className="treenodeTitle">
                <Icon
                  type="folder"
                  style={{ color: '#95A1B7', marginRight: 4 }}
                />
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span title={item.groupName} className="treenodeTitle">
                <Icon
                  type="folder"
                  style={{ color: '#95A1B7', marginRight: 4 }}
                />
                {item.groupName}
              </span>
            );
        }

        if (item.children) {
          return (
            <TreeNode
              dataRef={item}
              icon={<Icon type="folder" />}
              key={String(item.groupId)}
              title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            dataRef={item}
            icon={<Icon type="folder" />}
            key={String(item.groupId)}
            title={title}
          />
        );
      });
    return (
      <div className={styles.groupTreeWrapper}>
        <div className={styles.searchWrapper}>
          <div className={styles.title}>分组</div>
          <div className={styles.search}>
            <Search
              ref="search"
              style={{
                height: 32,
                marginBottom: 8,
                opacity: search ? 1 : 0
              }}
              placeholder="Search"
              onChange={this.onChange}
            />
            <Icon
              style={{ color: '#d9d9d9', zIndex: 12, margin: '8px 0 0 6px' }}
              type={`${search ? 'close-circle' : 'search'}`}
              onClick={(e) => {
                if (this.state.search) {
                  this.refs.search.input.input.style.width = '0px';
                  this.refs.search.input.input.style.transition = '.5s';
                  setTimeout(() => {
                    this.setState({ search: false });
                  }, 200);
                } else {
                  this.refs.search.input.input.style.width = '0px';
                  this.refs.search.input.input.style.transition = '0s';
                  setTimeout(() => {
                    this.setState({ search: true });
                    this.refs.search.input.input.style.width = '234px';
                    this.refs.search.input.input.style.transition = '.3s';
                  }, 0);
                }
              }}
            />
          </div>
        </div>
        <div className={styles.treeWrapper}>
          <Tree
            onDragEnd={this.onDragEnd}
            onDragEnter={this.onDragEnter}
            draggable={status === 'move'}
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            autoExpandParent={autoExpandParent}>
            {loop(dataTree)}
          </Tree>
        </div>
        <div className={styles.operateWrapper}>
          <span onClick={this.onAddChild} className={styles.operateItem}>
            <Icon
              style={{
                color: `${
                  status === 'add'
                    ? 'rgba(51, 124, 219, 1)'
                    : 'rgba(149, 161, 183, 1)'
                }`
              }}
              type="plus"
            />
          </span>
          <span onClick={this.onEdit} className={styles.operateItem}>
            <Icon
              style={{
                color: `${
                  status === 'edit'
                    ? 'rgba(51, 124, 219, 1)'
                    : 'rgba(149, 161, 183, 1)'
                }`
              }}
              type="edit"
            />
          </span>
          <span onClick={this.onMove} className={styles.operateItem}>
            <Icon
              style={{
                color: `${
                  status === 'move'
                    ? 'rgba(51, 124, 219, 1)'
                    : 'rgba(149, 161, 183, 1)'
                }`
              }}
              type="drag"
            />
          </span>
          <Popconfirm
            title="确定删除当前选中群组？"
            visible={status === 'delete'}
            onConfirm={this.handleDelete}
            onCancel={this.cancelDelete}
            okText="确定"
            cancelText="取消">
            <span onClick={this.onDelete} className={styles.operateItem}>
              <Icon
                style={{
                  color: `${
                    status === 'delete'
                      ? 'rgba(51, 124, 219, 1)'
                      : 'rgba(149, 161, 183, 1)'
                  }`
                }}
                type="delete"
              />
            </span>
          </Popconfirm>
        </div>
      </div>
    );
  }
}
