import React, { Component } from 'react';
import { Table } from 'antd';

class CommonTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
      current: 1,
      pageSize: 10,
      total: 0,
      tableParams: {}
    };
  }

  componentDidMount() {
    if (this.props.getTable) {
      this.props.getTable(this);
    }
    this.getData();
  }

  /**
   * 获取数据
   * getListApi： 请求数据的方法
   */
  getData = (current = 1, pageSize = 10) => {
    const { getListApi, params = {} } = this.props;
    const { tableParams = {} } = this.state;
    this.setState({
      loading: true,
      current,
      pageSize
    });
    getListApi(
      Object.assign({}, params, tableParams, {
        currentPage: this.state.current || 1,
        pageSize: this.state.pageSize || 10
      })
    )
      .then((rs) => {
        this.setState({
          list: rs.data || [],
          loading: false,
          // current: rs.currentPage !== undefined ? rs.currentPage : this.state.current || 1,
          // pageSize: rs.pageSize !== undefined ? rs.pageSize : this.state.pageSize || 10,
          total:
            rs.totalCount !== undefined ? rs.totalCount : this.state.total || 0
        });
      })
      .catch(() => {
        this.setState({
          loading: true
        });
      });
  };

  /**
   * 页码、过滤、排序修改
   * @param pagination
   * @param filters
   * @param sorter
   */
  onChange = (pagination, filters, sorter) => {
    // console.log('filters', filters)
    let tableParams = {};
    if (filters) {
      for (let key in filters) {
        if (filters[key] && Array.isArray(filters[key])) {
          tableParams[key] = filters[key];
        }
      }
    }
    if (sorter && sorter.order) {
      if (sorter.order === 'ascend') {
        tableParams['dateOrder'] = 0;
      } else {
        tableParams['dateOrder'] = 1;
      }
    }
    this.setState(
      {
        tableParams: tableParams,
        current: pagination.current || 1,
        pageSize: pagination.pageSize || 10
      },
      this.getData
    );
  };

  render() {
    const { list = [], loading = false, current, pageSize, total } = this.state;
    return (
      <Table
        loading={loading}
        dataSource={list}
        onChange={this.onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          total: total,
          size: 'small',
          showQuickJumper: true,
          showSizeChanger: true,
          hideOnSinglePage: false,
          showTotal: (total) => `共 ${total} 条`
        }}
        rowKey="id"
        className="common-table"
        {...this.props}
        // scroll={{ y: 'calc(100vh - 400px)' }}
      />
    );
  }
}

export default CommonTable;
