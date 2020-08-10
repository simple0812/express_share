import React from 'react';
import PropTypes from 'prop-types';
// import { Resizable } from 'react-resizable';
import _ from 'lodash';
import cn from 'classnames';
// import 'react-resizable/css/styles.css';
import { Table, Popconfirm } from 'antd';
import AutoSizer from 'react-virtualized-auto-sizer';

import styles from './index.less';

let resizeTime = null;
function preventSortFn(onClick, evt) {
  if (resizeTime && Date.parse(new Date()) - resizeTime < 1000) {
    evt.preventDefault();
    evt.stopPropagation();
    return;
  }

  if (_.isFunction(onClick)) {
    onClick(evt);
  }
}

// const ResizeableTitle = (props) => {
//   const {
//     onResize,
//     onResizeStop,
//     onResizeStart,
//     width,
//     height,
//     resize,
//     title,
//     onClick,
//     ...restProps
//   } = props;

//   if (!width || !resize) {
//     return <th onClick={onClick} {...restProps} />;
//   }

//   return (
//     <Resizable
//       width={width}
//       height={height || NaN}
//       onResize={onResize}
//       axis="x"
//       onResizeStop={onResizeStop}
//       onResizeStart={onResizeStart}>
//       <th onClick={preventSortFn.bind(null, onClick)} {...restProps} />
//     </Resizable>
//   );
// };

class YlTable extends React.Component {
  static propTypes = {
    onRemove: PropTypes.func,
    onSelectChange: PropTypes.func,
    onShowDetail: PropTypes.func,
    onSort: PropTypes.func,
    onShowEdit: PropTypes.func,
    dataSource: PropTypes.array,
    operateColumns: PropTypes.element,
    pageConditions: PropTypes.object,
    scrollHeight: PropTypes.number,
    columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  static defaultProps = {
    pageConditions: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      resize: {}
    };
  }


  handleResize = (index) => (e, { size }) => {
    e.preventDefault();
    e.stopPropagation();
    var xWidth = size.width || 150;
    if (xWidth < 150) {
      xWidth = 150;
    }

    var resize = this.state.resize;
    resize[index + ''] = xWidth;

    this.setState({
      resize
    });
  };

  handleHeaderCell = (index, column) => {
    return {
      width: parseInt(column.width, 10),
      title: column.dataIndex,
      resize: true,
      // onClick: this.handleHeaderCellClick,
      onResize: this.handleResize(index),
      onResizeStop: () => {
        resizeTime = Date.parse(new Date());
      }
    };
  };

  // 修改列宽
  processColumns = (rawColumns) => {
    const { resizable } = this.props;
    let columns = [
      // { title: '序号', fixed:'left', dataIndex: '', key: '' , width:'60px', render: (text, record, index) => (index + 1)},
    ];

    rawColumns.forEach((each, index) => {
      let p = {
        ...each
      };

      var resizeWidth = this.state.resize[index + ''];
      if (resizeWidth) {
        p.width = resizeWidth;
      }

      if (resizable) {
        p.onHeaderCell = this.handleHeaderCell.bind(this, index);
      }

      columns.push(p);
    });

    return columns;
  };

  getOperateColumn = () => {
    const {
      onShowDetail,
      onShowEdit,
      onRemove,
      getExtraOperateColumns,
      operateColumnProps = {}
    } = this.props;

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

  rewriteComponents = () => {
    const { resizable } = this.props;

    const components = {};

    // if (resizable) {
    //   components.header = {
    //     cell: ResizeableTitle
    //   };
    // }

    return components;
  };

  /** TODO
   * 1.如过没有固定列 且每列都有宽度 则在当列的总宽度<table宽度的时候 会按照比例放大占满table (默认行为 不用处理)
   * 2.如过没有固定列 且有部分没有宽度 则 没有设置宽度的列平分剩余的宽度 (如果计算后每列动态宽度 < 150 设置为150)
   * 注: 如果有固定列 并且每列都有宽度 当列的总宽度<table宽度的时候会出现断裂
   * 3.如过有固定列 且每列都有宽度 当所有列的宽度 < table宽度 则 将非固定列的宽度 按比例放大
   * 4.如过有固定列 且有部分没有宽度 则没有设置宽度的列平分剩余的宽度 (如果计算后每列动态宽度 < 150 设置为150)
   */
  getColumnsFromModel = (model, tableWidth, options = {}) => {
    let { selectable, operateColumnProps, tableProps } = options;

    let hasFixedCol = selectable;

    if (_.isEmpty(model)) {
      return [];
    }
    let keys = _.keys(model);

    let cols = keys.map((key, index) => {
      let col = model[key];
      if (!_.isObject(col)) {
        col = {
          title: col,
          ellipsis: true,
          width: 150
        };
      }

      let p = {
        dataIndex: key,
        key,
        ...col
      };

      if (p.fixed) {
        hasFixedCol = true;
      }

      // // 如果有固定列并且所有col都设置了宽度 则删除最后一列的宽度
      // if (index === keys.length - 1) {
      //   if (!hasAutoWidthCol && hasFixedCol) {
      //     delete p.width;
      //   }
      // }

      return p;
    });

    let colCount = _.countBy(cols, (each) => !each.width);

    let autoWidthColCount = colCount.true || 0;
    let haswidthColCount = colCount.false || 0;
    let currWidth = _.sumBy(cols, (each) => +each.width || 0);
    let nonFixedWidth = _.sumBy(cols, (each) => {
      if (!each.fixed) {
        return each.width || 0;
      }

      return 0;
    });

    let fixedWidth = _.sumBy(cols, (each) => {
      if (each.fixed) {
        return each.width || 0;
      }

      return 0;
    });

    if (selectable) {
      currWidth += 62; // checkbox列宽
      fixedWidth += 62;
    }

    // 如果有操作列
    if (
      _.isFunction(tableProps.onShowDetail) ||
      _.isFunction(tableProps.onShowEdit) ||
      _.isFunction(tableProps.onRemove) ||
      _.isFunction(tableProps.getExtraOperateColumns)
    ) {
      currWidth += _.get(operateColumnProps, 'width') || 150;
      fixedWidth += _.get(operateColumnProps, 'width') || 150;

      hasFixedCol = true;
      if (_.has(operateColumnProps, 'fixed')) {
        hasFixedCol = operateColumnProps.fixed;
      }
    }

    // 处理 2，4
    if (autoWidthColCount) {
      let avgWidth = (tableWidth - currWidth) / autoWidthColCount;

      if (avgWidth < 150) {
        avgWidth = 150;
      }

      cols
        .filter((each) => !each.width)
        .forEach((each, index) => {
          // 最后一列 不设置宽度 自适应 消除计算导致的误差
          if (index !== autoWidthColCount - 1) {
            each.width = avgWidth;
          }
        });
    } else if (haswidthColCount) {
      // 处理 3
      if (hasFixedCol && currWidth < tableWidth) {
        let rate = (tableWidth - fixedWidth) / nonFixedWidth;

        cols
          .filter((each) => !each.fixed)
          .forEach((each, index) => {
            // 最后一列 不设置宽度 自适应 消除计算导致的误差
            if (index === haswidthColCount - 1) {
              each.width = undefined;
            } else {
              each.width = +(each.width * rate).toFixed(1);
            }
          });
      }
    }

    return cols;
  };

  render() {
    var {
      scroll,
      columns,
      selectable,
      className,
      dataSource,
      rowSelection,
      onRowDoubleClick,
      pagination,
      isFullScreen,
      rowKey,
      getRowKey,
      operateColumnProps,
      columnData,

      ...restProps
    } = this.props;

    /**
     * 父容器会自动添加position: relative的属性
     * 需要手动添加 overflow:hidden属性 否则可能会出现抖动(父容器滚动条导致的)
     * 父级别容器使用flex布局可以动态填满空间
     */

    return (
      <AutoSizer>
        {({ width, height }) => {
          let xCol = this.getColumnsFromModel(columnData, width - 28, {
            selectable,
            operateColumnProps,
            tableProps: this.props
          });

          let tableColumns = this.processColumns(xCol);
          const optColumn = this.getOperateColumn();

          if (optColumn) {
            tableColumns.push(optColumn);
          }

          const tableScroll = {
            x: _.sumBy(tableColumns, (each) => each.width || 150),
            y: pagination ? height - 120 : height - 70
          };

          return (
            <div className={styles.ylTable} style={{ width, height: height }}>
              <Table
                rowKey={getRowKey || 'id'}
                className={cn('common-table-container', { isFullScreen })}
                columns={tableColumns}
                scroll={tableScroll}
                dataSource={dataSource || []}
                components={this.rewriteComponents()}
                rowSelection={rowSelection}
                pagination={pagination || false}
                {...restProps}
              />
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}

export default YlTable;
