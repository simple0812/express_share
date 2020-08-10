import React, { Component } from 'react';
import { TreeSelect, Icon } from 'antd';
import { get } from '@/service/xhr/fetch';
import response from './response';
const { TreeNode } = TreeSelect;

export default class GroupUserTreeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      trees: [],
      checkedKeys: []
    };
  }
  static getDerivedStateFromProps(props, state) {
    const { value = [] } = props;
    state.value = value;
    return state;
  }

  componentDidMount() {
    // const url = '/group/ListGroupAndUser.json'
    // get(url).then(res => {
    //     const { data = [] } = res
    //     this.setState({
    //         trees: data
    //     })
    // })
    const { data = [] } = response;
    this.setState({
      trees: data
    });
  }

  onChange = (selects) => {
    this.setState(
      {
        value: selects
      },
      () => {
        this.props.onChange && this.props.onChange(selects);
      }
    );
  };

  renderTreeNode = (tree) => {
    const render = (treeNodes, level) => {
      return treeNodes.map((item, index) => {
        const { name, id, children = [], isUser = false } = item;
        const currentLevel = level ? `${level}-${index}` : String(index);
        const icon = !isUser ? <Icon type="home" /> : <Icon type="user" />;
        return (
          <TreeNode
            icon={icon}
            checkable={isUser}
            value={`${currentLevel}_${id}`}
            title={name}
            selectable={false}
            key={currentLevel}>
            {children.length > 0 && render(children, currentLevel)}
          </TreeNode>
        );
      });
    };
    return render(tree, '');
  };

  render() {
    const { trees = [] } = this.state;

    return (
      <TreeSelect
        treeCheckable={true}
        showSearch
        treeIcon={true}
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择分组"
        allowClear
        multiple={true}
        treeDefaultExpandAll
        onChange={this.onChange}
        treeNodeFilterProp="title">
        {this.renderTreeNode(trees)}
      </TreeSelect>
    );
  }
}
