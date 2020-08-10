import React, { Component } from 'react';
import _ from 'lodash';

import Table from '../YlTable';
import CombineSearch from '../CombineSearch';
import CommonEditor from '../CommonEditor';
import message from '@/components/Message';
import { toJS } from 'mobx';

export default class BaseTablePage extends Component {
  constructor(props) {
    super(props);
    this.fieldMap = {
      dataList: 'dataList', // 数据源
      currentPage: 'currentPage', // 当前页数
      pageSize: 'pageSize', // 每页条数

      batchRemoveIds: 'ids' // 删除时候传参
    };

    this.primaryKey = 'id'; // 主键
    this.state = {
      editVisible: false, //编辑框是否可见
      searchConditions: {},
      pageConditions: {
        // sort: 0,
        // sortBy: '',
        pageSize: 10,
        current: 1,
        total: 1
      }
    };
  }

  handleSearch = (evt) => {
    const { pageConditions } = this.state;
    pageConditions.current = 1;
    this.setState(
      {
        searchConditions: evt || {},
        pageConditions
      },
      () => {
        this.fetchData();
      }
    );
  };

  handleChange = ({ current, pageSize } = {}, filters, sorter) => {
    const { pageConditions } = this.state;

    pageConditions.current = current;
    pageConditions.pageSize = pageSize;
    pageConditions.sortBy = _.get(sorter, 'field') || '';
    pageConditions.sort = _.get(sorter, 'order') || ''; // 'descend', 'ascend'
    this.setState(
      {
        pageConditions
      },
      () => {
        this.fetchData();
      }
    );
  };

  handleExport = () => {
    let params = this.getSearchConditions();
    const { currentPage, pageSize, ...restPrams } = params || {};
    restPrams.taskCenterName = this.state.taskCenterName;

    if (this.store && _.isFunction(this.store.export)) {
      this.store.export(restPrams).then((res) => {
        if (res && res.success) {
          message.success('导出成功');
          this.setState({
            exportVisible: false,
            taskCenterName: ''
          });
        }
      });
    }
  };

  // 页面查询参数
  getPageParams = () => {
    let {
      pageConditions: { current, pageSize, sort, sortBy } = {},
      searchConditions
    } = this.state;

    let xParams = {
      [this.fieldMap.currentPage]: current,
      [this.fieldMap.pageSize]: pageSize,
      ...searchConditions
    };

    if (!_.isUndefined(sort)) {
      xParams.sortBy = sortBy;
      xParams.sort = sort === 'descend' ? 0 : 1;
    }

    return xParams;
  };

  getSearchConditions = () => {
    if (
      this.combineSearchRef &&
      _.isFunction(this.combineSearchRef.getSearchConditions)
    ) {
      return this.combineSearchRef.getSearchConditions();
    }

    return {};
  };

  fetchData = () => {
    let { pageConditions: { current, pageSize, total } = {} } = this.state;
    let xParams = this.getPageParams();

    if (!this.store) {
      throw new Error('store is undefined');
    }

    this.store
      .getList(xParams)
      .then((res) => {
        this.setState({
          pageConditions: {
            current,
            pageSize,
            total: (res.totalCount !== undefined ? res.totalCount : total) || 0
          }
        });

        return res;
      })
      .catch((e) => {});
  };

  handleRemove = (record) => {
    if (!this.store) {
      throw new Error('store is undefined');
    }
    const { pageConditions } = this.state;
    this.store
      .remove({
        [this.fieldMap.batchRemoveIds]: record[this.primaryKey]
      })
      .then((res) => {
        pageConditions.current = 1;
        this.setState(
          {
            pageConditions
          },
          this.fetchData
        );
      });
  };

  handleBatchRemove = () => {
    if (!this.store) {
      throw new Error('store is undefined');
    }
    const { pageConditions, selectedRowKeys } = this.state;
    if (_.isEmpty(selectedRowKeys)) {
      return message.warning('请选择需要删除的项目');
    }
    this.store
      .remove({
        [this.fieldMap.batchRemoveIds]: (selectedRowKeys || []).join(',')
      })
      .then((res) => {
        pageConditions.current = 1;
        this.setState(
          {
            pageConditions
          },
          this.fetchData
        );
      });
  };

  handleShowEdit = (record) => {
    this.setState({
      currentModel: record,
      editVisible: true
    });
  };

  handleSave = (params) => {
    const { update, create } = this.store;
    const { pageConditions = {} } = this.state;

    let method = create;
    let operate = '添加';

    // 根据是否含有主键来判断是新增还是更新
    if (params && params[this.primaryKey]) {
      method = update;
      operate = '编辑';
    }

    return method(params).then((res) => {
      if (!res || +res.code !== 200) {
        throw new Error(_.get(res, 'message') || `${operate}失败`);
      }
      if (res && +res.code === 200) {
        this.toggleEditVisible();

        pageConditions.current = 1;
        this.setState(
          {
            pageConditions
          },
          () => {
            this.fetchData();
          }
        );
      }

      return res;
    });
  };

  toggleEditVisible = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  };

  handleShowDetail = (record) => {
    this.setState({
      currentModel: record,
      detailVisible: true
    });
  };

  /**
   * tableTime: {
        label: '发起时间',
        control: 'rangePicker', // 组件类型

        startKey: 'startTime', //control=rangePicker 特有
        endKey: 'endTime', //control=rangePicker 特有

        minKey: 'min', //control=rangeNumber 特有
        maxKey: 'max', //control=rangeNumber 特有

        selectOptions: [], //control=select 等特有 可以是函数和数组
        showAllOption: false, // control=select 等特有 是否添加 ‘全部’

        fieldDecorator: {  // form表单的属性 
          initialValue: [] // 设置组件的初始化值 建议通过getInitialValue设置
        },

        getInitialValue: null, // 将初始搜索条件转为组件初始值 函数 
        dataFormat:(val, index) => { // 将组件的值转化为搜索时需要的格式
          if (!moment.isMoment(val)) {
            return val;
          }

          let timeFormat = index === 0 ? '00:00:00' : '23:59:59';
          return val.format(`YYYY-MM-DD ${timeFormat}`)
        },
        controlProps: { // 组件属性
          style: { width: 250 },
          format: 'YYYY-MM-DD'
        }
      }
   */

  getSearchDataFrom = () => {
    if (_.isEmpty(this.searchData)) {
      return [];
    }
    let ret = [];
    _.keys(this.searchData).forEach((key, index) => {
      let val = this.searchData[key];

      if (_.isString(val)) {
        val = {
          label: val,
          fieldDecorator: {}
        };
      }

      if (_.isEmpty(val.fieldDecorator)) {
        val.fieldDecorator = {};
      }

      if (
        _.isFunction(val.getInitialValue) &&
        _.isUndefined(val.fieldDecorator.initialValue)
      ) {
        val.fieldDecorator.initialValue = val.getInitialValue();
      }

      ret.push({
        id: key,
        sort: index,
        ...val
      });
    });

    return ret;
  };

  renderTable = ({
    resizable,
    selectable,
    onRemove,
    onShowEdit,
    onShowDetail,
    scroll,
    isFullScreen,
    rowSelection,
    operateColumnProps,
    ...restProps
  } = {}) => {
    const { globalLoading } = this.store;
    const { pageConditions: { current, pageSize, total } = {} } = this.state;

    if (selectable && _.isEmpty(rowSelection)) {
      rowSelection = {
        fixed: true,
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({ selectedRowKeys, selectedRows });
        }
      };
    }

    let tableProps = {
      selectable,
      className: 'common-table',
      dataSource: toJS(this.store[this.fieldMap.dataList]),
      resizable: !!resizable,
      loading: globalLoading.getList === 'pending',
      isFullScreen: !!isFullScreen,
      // columns: xCol,
      operateColumnProps,
      onChange: this.handleChange,

      onRemove: onRemove,
      onShowEdit: onShowEdit,
      onShowDetail: onShowDetail,
      rowSelection: rowSelection,

      getRowKey: this.primaryKey,
      columnData: this.columnData || {},

      pagination: {
        current: current,
        pageSize: pageSize,
        total: total,
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        hideOnSinglePage: false,
        showTotal: (total) => `共 ${total}, 条`
      },

      ...restProps
    };

    return <Table {...tableProps} />;
  };

  renderSearch = (props) => {
    let items = this.getSearchDataFrom();

    if (_.isEmpty(items)) {
      return '';
    }

    return (
      <CombineSearch
        wrappedComponentRef={(ref) => (this.combineSearchRef = ref)}
        combineSearchItems={items}
        onSearch={this.handleSearch}
        {...props}
      />
    );
  };

  generateEditorFormData = ({ isReadonly } = {}) => {
    if (_.isEmpty(this.editorData)) {
      return [];
    }
    let ret = [];
    _.keys(this.editorData).forEach((key, index) => {
      let val = this.editorData[key];

      if (_.isString(val)) {
        val = {
          label: val,
          fieldDecorator: {},
          controlProps: {
            disabled: isReadonly
          }
        };
      } else {
        val.controlProps = {
          ...val.controlProps,
          disabled: isReadonly
        };
      }

      ret.push({
        id: key,
        sort: index,
        ...val
      });
    });

    return ret;
  };

  renderEditor = (props) => {
    const { editVisible, currentModel } = this.state;
    const { globalLoading } = this.props;
    let { postTitle, isReadonly, ...restProps } = props || {};

    let items = this.generateEditorFormData({isReadonly});

    if (_.isEmpty(items)) {
      return '';
    }

    let isUpdate = !!_.get(currentModel, this.primaryKey);
    return (
      <CommonEditor
        title={`${isUpdate ? '编辑' : '添加'}${postTitle}`}
        editorItems={items}
        visible={editVisible}
        globalLoading={globalLoading}
        onClose={this.toggleEditVisible}
        onSave={this.handleSave}
        isUpdate={isUpdate}
        isReadonly={isReadonly}
        model={currentModel || {}}
        {...restProps}
      />
    );
  };
}
