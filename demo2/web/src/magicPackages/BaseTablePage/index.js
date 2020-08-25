/**
 * 覆写基类方式的时候 如果需要先调用基类的方法 有2中模式
 * 1.在constructor中 定义一个变量指向基类的方法 在覆写方法里面调用该变量
 * 2.基类方法使用具名函数(如生命周期函数) 子类覆写时候使用super.methodName()调用。(箭头函数是匿名函数 不可使用)
 * 3.覆写时 如不需调用基类方法 可随意发挥
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Modal, Popconfirm } from 'antd';
import Table from '../YlTable';
import CombineSearch from '../CombineSearch';
import CommonEditor, { generateEditorFormData } from '../CommonEditor';
import message from '@/components/Message';
import { toJS } from 'mobx';

export default class BaseTablePage extends Component {
  constructor(
    props,
    {
      fieldMap, // 字段映射
      primaryKey, // 主键
      initSearchConditions, // 初始查询条件
      shouldGetDetailWhenEdit, // 编辑时是否需要发送请求获取详情
      shouldGetDetailWhenShowDetail, // 显示详情时是否需要发送请求获取详情
      queryConditions, // 其他参数(如url传递过来的)
      pageConditions //分页参数
    } = {}
  ) {
    super(props);
    this.fieldMap = {
      dataList: 'dataList', // 数据源
      currentPage: 'currentPage', // 当前页数
      pageSize: 'pageSize', // 每页条数

      batchRemoveIds: 'ids', // 删除时候传参
      ...fieldMap
    };

    this.primaryKey = primaryKey || 'id';
    this.initSearchConditions = {
      ...initSearchConditions
    };

    this.shouldGetDetailWhenEdit = !!shouldGetDetailWhenEdit;
    this.shouldGetDetailWhenShowDetail = !!shouldGetDetailWhenShowDetail;
    this.state = {
      editVisible: false, //编辑框是否可见
      searchConditions: {
        ...initSearchConditions
      },
      queryConditions: {
        ...queryConditions
      },
      pageConditions: {
        // sort: 0,
        // sortBy: '',
        pageSize: 10,
        current: 1,
        total: 1,
        ...pageConditions
      }
    };
  }

  handleSearch = (evt) => {
    const { pageConditions } = this.state;
    pageConditions.current = 1;
    this.setState(
      {
        searchConditions: evt || {},
        pageConditions,
        selectedRowKeys: []
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

  // 列表搜索参数由3部分构成 分页参数、搜索参数、其他参数(如url传递过来的)
  getPageParams = () => {
    let {
      pageConditions: { current, pageSize, sort, sortBy } = {},
      searchConditions,
      queryConditions
    } = this.state;

    let xParams = {
      [this.fieldMap.currentPage]: current,
      [this.fieldMap.pageSize]: pageSize,
      ...searchConditions,
      ...queryConditions
    };

    if (sort) {
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
      .getList({ ...xParams })
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

  getDetail = (params) => {
    return this.store
      .getDetail({ [this.primaryKey]: params[this.primaryKey] })
      .then((res) => {
        if (res && res.success) {
          return Promise.resolve(res.data);
        }
        throw new Error(_.get(res, 'message') || '获取详情失败');
      });
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
            selectedRowKeys: [],
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
    let _this = this;

    Modal.confirm({
      title: '确定要删除选中的项目?',
      onOk() {
        _this.store
          .remove({
            [_this.fieldMap.batchRemoveIds]: (selectedRowKeys || []).join(',')
          })
          .then((res) => {
            pageConditions.current = 1;
            _this.setState(
              {
                selectedRowKeys: [],
                pageConditions
              },
              _this.fetchData
            );
          });
      },
      onCancel() {}
    });
  };

  handleShowEdit = (record) => {
    this.setState({
      currentModel: record,
      editVisible: true
    });

    if (_.isEmpty(record)) {
      return;
    }

    if (this.shouldGetDetailWhenEdit) {
      this.getDetail(record).then((res) => {
        this.setState({
          currentModel: res
        });
      });
    }
  };

  handleSave = (params, model) => {
    const { update, create, currentModel } = this.store;
    const { pageConditions = {} } = this.state;

    let method = create;
    let operate = '添加';
    let xParams = { ...params };

    // 根据是否含有主键来判断是新增还是更新
    if (model && model[this.primaryKey]) {
      method = update;
      xParams[this.primaryKey] = model[this.primaryKey];
      operate = '编辑';
    }

    return method(xParams).then((res) => {
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

    if (_.isEmpty(record)) {
      return;
    }

    if (this.shouldGetDetailWhenShowDetail) {
      this.getDetail(record).then((res) => {
        this.setState({
          currentModel: res
        });
      });
    }
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
        convertToSearchFormat:(val, key) => { // 将组件的值转化为搜索时需要的格式
          if (!moment.isMoment(val)) {
            return val;
          }

          let timeFormat = key === 'startTime' ? '00:00:00' : '23:59:59';
          return val.format(`YYYY-MM-DD ${timeFormat}`)
        },

        colProps: {}, // 组件Col的属性 用于控制组件宽度
        labelStyle: {}, // 设置label的样式,
        wrapperStyle: {}, // 设置组件容器的样式
        
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

  getOperateColumn = ({
    onShowDetail,
    onShowEdit,
    onRemove,
    getExtraOperateColumns,
    operateColumnProps = {}
  }) => {
    if (
      !_.isFunction(onShowDetail) &&
      !_.isFunction(onShowEdit) &&
      !_.isFunction(onRemove) &&
      !_.isFunction(getExtraOperateColumns)
    ) {
      return;
    }

    let col = {
      title: '操作',
      dataIndex: 'optionColumn',
      fixed: _.isUndefined(operateColumnProps.fixed)
        ? 'right'
        : operateColumnProps.fixed,
      key: 'optionColumn',
      width: _.get(operateColumnProps, 'width') || 150,
      render: (text, record, index) => {
        return (
          <span className="table_operation">
            {_.isFunction(onShowDetail) && (
              <span
                style={{ margin: '0 5px', cursor: 'pointer', color: '#00B9EF' }}
                onClick={onShowDetail.bind(this, record)}>
                查看
              </span>
            )}
            {_.isFunction(onShowEdit) && (
              <span
                style={{ margin: '0 5px', cursor: 'pointer', color: '#00B9EF' }}
                onClick={onShowEdit.bind(this, record)}>
                编辑
              </span>
            )}
            {_.isFunction(onRemove) && (
              <Popconfirm
                title="确定删除？"
                onConfirm={onRemove.bind(this, record)}
                okText="确定"
                cancelText="取消">
                <span
                  style={{
                    margin: '0 5px',
                    cursor: 'pointer',
                    color: '#00B9EF'
                  }}>
                  删除
                </span>
              </Popconfirm>
            )}
            {_.isFunction(getExtraOperateColumns) &&
              getExtraOperateColumns(text, record, index)}
          </span>
        );
      }
    };

    return col;
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
    getExtraOperateColumns,
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
    let xDataSource = toJS(this.store[this.fieldMap.dataList]);

    let xColumnData = this.columnData || {};

    let operateCol = this.getOperateColumn({
      onShowDetail,
      onShowEdit,
      onRemove,
      getExtraOperateColumns,
      operateColumnProps
    });

    if (operateCol) {
      xColumnData.optionColumn = operateCol;
    }

    let tableProps = {
      selectable,
      className: 'common-table',
      dataSource: xDataSource,
      resizable: !!resizable,
      loading: globalLoading.getList === 'pending',
      isFullScreen: !!isFullScreen,
      onChange: this.handleChange,
      rowSelection: rowSelection,

      getRowKey: this.primaryKey,
      columnData: xColumnData,

      // 没有数据不显示分页插件
      pagination: _.isEmpty(xDataSource)
        ? false
        : {
            current: current,
            pageSize: pageSize,
            total: total,
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            hideOnSinglePage: false,
            showTotal: (total) => `共 ${total} 条`
          },

      ...restProps
    };

    return <Table {...tableProps} />;
  };

  renderSearch = (props) => {
    let items = this.getSearchDataFrom();

    // if (_.isEmpty(items)) {
    //   return '';
    // }

    return (
      <CombineSearch
        wrappedComponentRef={(ref) => (this.combineSearchRef = ref)}
        combineSearchItems={items}
        onSearch={this.handleSearch}
        {...props}
      />
    );
  };

  renderEditor = (props) => {
    const { editVisible, currentModel } = this.state;
    const { globalLoading } = this.props;
    let { postTitle, isReadonly, ...restProps } = props || {};

    let items = generateEditorFormData.call(this, {
      isReadonly,
      editorData: this.editorData
    });

    if (_.isEmpty(items)) {
      return '';
    }

    let isUpdate = !!_.get(currentModel, this.primaryKey);

    return (
      <CommonEditor
        title={`${isUpdate ? '编辑' : '添加'}${postTitle}`}
        editorItems={items}
        visible={editVisible}
        // globalLoading={globalLoading}
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
