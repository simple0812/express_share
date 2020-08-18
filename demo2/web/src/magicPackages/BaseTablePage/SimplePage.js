import React from 'react';
import { Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import BaseTablePage from './index';

import styles from './page.less';

// 注：继承SimplePage后 一定要传入store 并且赋值给this.store
class SimplePage extends BaseTablePage {
  constructor(props, initOptions) {
    let xInitOptions = {
      fieldMap: {
        batchRemoveIds: 'id'
      },
      primaryKey: 'id',
      initSearchConditions: {},
      ...initOptions
    };

    super(props, xInitOptions);

    this.state = {
      ...this.state
    };

    this.columnData = {
      id: {
        title: '序号',
        width: 80,
        fixed: 'left'
        // render: (text, record, index) => index + 1
      },
      title: { title: '标题', width: 150, ellipsis: true },
      author: { title: '作者', width: 180 },
      summary: { title: '摘要', ellipsis: true },
      createdAt: {
        title: '日期',
        width: 250,
        render: (text) =>
          text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
      remark: { title: '备注', width: 180, ellipsis: true }
    };

    this.searchData = {
      // title: {
      //   label: '标题',
      //   controlProps: {
      //     // style: { width: 150 }
      //   }
      // },
      // author: {
      //   label: '作者',
      //   controlProps: {
      //     // style: { width: 150 }
      //   },
      //   colProps: {
      //     // span: 6
      //   }
      // },
      title: '标题',
      authro: '作者',
      tableTime: {
        label: '时间',
        startKey: 'queryBeginDate',
        endKey: 'queryEndDate',
        control: 'rangePicker',
        getInitialValue: () => {
          let searchConditions = this.initSearchConditions || {};

          if (
            searchConditions.queryBeginDate &&
            searchConditions.queryEndDate
          ) {
            return [
              moment(searchConditions.queryBeginDate),
              moment(searchConditions.queryEndDate)
            ];
          }

          return [];
        },

        convertToSearchFormat: (val, key) => {
          if (!moment.isMoment(val)) {
            return val;
          }

          // let timeFormat = key === 'queryBeginDate' ? '00:00:00' : '23:59:59';
          return val.format(`YYYY-MM-DD`);
        },
        controlProps: {
          // style: { width: 250 },
          format: 'YYYY-MM-DD'
        }
      }
    };

    /*编辑控件数据源*/
    this.editorData = {
      title: '标题',
      author: '作者',
      treeSelect: {
        label: '部门',
        control: 'treeSelect',
        idKey: 'value',
        options: [
          {
            title: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [
              {
                title: 'Child Node1',
                value: '0-0-0',
                key: '0-0-0'
              }
            ]
          },
          {
            title: 'Node2',
            value: '0-1',
            key: '0-1',
            children: [
              {
                title: 'Child Node3',
                value: '0-1-0',
                key: '0-1-0'
              },
              {
                title: 'Child Node4',
                value: '0-1-1',
                key: '0-1-1'
              },
              {
                title: 'Child Node5',
                value: '0-1-2',
                key: '0-1-2'
              }
            ]
          }
        ],
        isTree: true
      },
      summary: {
        label: '摘要',
        control: 'textarea',
        // renderBefore: () => {
        //   return (
        //     <div style={{ height: '100%', display: 'inline-block' }}>
        //       before
        //     </div>
        //   );
        // },
        // renderAfter: () => {
        //   return 'after';
        // },
        controlProps: {
          style: {
            height: '100px',
            width: 'calc(100% - 100px)'
          }
        }
      },
      content: {
        label: '内容',
        control: 'textarea',
        controlProps: {
          style: {
            height: '100px'
          }
        }
      },
      select: {
        label: 'select',
        control: 'select',
        options: [{ label: 'aaa', key: 'a' }]
      },
      checkbox: {
        label: 'checkbox',
        control: 'checkbox',
        options: [
          { label: 'aaa', value: 'a' },
          { label: 'bbb', value: 'b' }
        ]
      },
      radio: {
        label: 'radio',
        control: 'radio',
        options: [
          { label: 'aaa', value: 'a' },
          { label: 'bbb', value: 'b' }
        ]
      },
      remark: '备注'
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className={styles.simplePage} style={{ padding: 24 }}>
        <div className="header-search">
          <div className="header-search__left">
            {this.renderSearch({
              restButton: (
                <Button
                  type="primary"
                  ghost
                  onClick={this.handleShowEdit.bind(this, null)}
                  style={{ marginLeft: 8 }}>
                  添加
                </Button>
              )
            })}
          </div>
          {/* <div className="header-search__right"></div> */}
        </div>

        <div className="page-body">
          {this.renderTable({
            onRemove: this.handleRemove,
            onShowEdit: this.handleShowEdit,
            // resizable: true,
            selectable: true,
            // operateColumnProps: { width: 100, fixed: false },

            isFullScreen: true // autosizer 需要配合position:relative使用
          })}
        </div>
        {this.renderEditor({
          postTitle: '博客'
        })}
      </div>
    );
  }
}

export default SimplePage;
