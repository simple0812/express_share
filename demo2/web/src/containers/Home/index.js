import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import { inject, observer } from 'mobx-react';

import BaseTablePage from '@/magicPackages/BaseTablePage';
import { downloadFile } from '@/utils';

import styles from './index.less';

@inject((store) => {
  return {
    blogStore: store.blogStore,
    globalLoading: store.blogStore.globalLoading
  };
})
@observer
class TestPage extends BaseTablePage {
  constructor(props) {
    super(props);
    this.store = props.blogStore;
    this.primaryKey = 'id';
    this.fieldMap = {
      ...this.fieldMap,
      batchRemoveIds: 'id'
    };

    let xDate = moment().format('YYYY-MM-DD');

    // 预置的搜索条件
    this.initSearchConditions = {
      queryBeginDate: `${xDate}`,
      queryEndDate: `${xDate}`
    };

    this.state = {
      ...this.state,

      searchConditions: {
        ...this.initSearchConditions
      }
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
      title: {
        label: '标题',
        controlProps: {
          style: { width: 150 }
        }
      },
      author: {
        label: '作者',
        controlProps: {
          style: { width: 150 }
        }
      },
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

        dataFormat: (val, index) => {
          if (!moment.isMoment(val)) {
            return val;
          }

          // let timeFormat = index === 0 ? '00:00:00' : '23:59:59';
          return val.format(`YYYY-MM-DD`);
        },
        controlProps: {
          style: { width: 250 },
          format: 'YYYY-MM-DD'
        }
      }
    };

    /*编辑控件数据源*/
    this.editorData = {
      title: '标题',
      author: '作者',
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

  export = () => {
    let params = this.getSearchConditions();
    const {
      pageConditions: { current, pageSize }
    } = this.state;

    let url =
      '/efficiency/service/quality/PersonalEffectivenessListExport.json';
    downloadFile(url, '热线参数满意度监察.csv', {
      ...params,
      current,
      pageSize
    });
  };

  render() {
    return (
      <div className={styles.testPage} style={{ padding: 24 }}>
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

export default TestPage;
