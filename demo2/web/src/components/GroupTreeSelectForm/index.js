import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { get } from '@/service/xhr/fetch';
const { TreeNode } = TreeSelect;

export default class GroupTreeSelectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      trees: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    let { value = '[]' } = props;
    try {
      value = JSON.parse(value);
      value = value.map((item) => item.value);
    } catch (err) {
      value = [];
    }
    state.value = value;
    return state;
  }

  componentDidMount() {
    const url = '/efficiency/component/ListWorkOrderProcessUnit.json';
    get(url).then((res) => {
      const { data = [] } = res;
      this.setState({
        trees: data
      });
    });
  }

  onChange = (selects, labels) => {
    const temp = selects.map((key, index) => {
      return {
        label: labels[index],
        value: key
      };
    });
    let res = JSON.stringify(temp);
    this.props.onChange && this.props.onChange(selects, res);
  };

  renderTreeNode = (tree) => {
    const render = (treeNodes, level) => {
      return treeNodes.map((item, index) => {
        const { children = [], groupName, id } = item;
        const currentLevel = level ? `${level}-${index}` : String(index);
        return (
          <TreeNode value={id} title={groupName} key={currentLevel}>
            {render(children, currentLevel)}
          </TreeNode>
        );
      });
    };
    return render(tree, '');
  };

  render() {
    const { trees = [] } = this.state;
    const { multiple = false } = this.props;
    return (
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择"
        allowClear
        multiple={multiple}
        treeDefaultExpandAll
        onChange={this.onChange}
        treeNodeFilterProp="title">
        {this.renderTreeNode(trees)}
      </TreeSelect>
    );
  }
}
