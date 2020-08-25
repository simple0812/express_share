import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Upload, Icon } from 'antd';

import styles from './index.less';

class DraggerUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  fileChange = (e) => {
    const { onChange } = this.props;

    let fileList = [...e.fileList];

    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data;
      }
      return file;
    });

    if (_.isFunction(onChange)) {
      onChange(fileList);
    }
  };

  render() {
    const {
      value,
      onChange,
      style,
      placeholder,
      text,
      ...restProps
    } = this.props;
    let uploadHeaders = {};
    if (process.env.NODE_ENV === 'development') {
      uploadHeaders = { Authorization: `Bearer ${window.authToken}` };
    }

    const uploadProps = {
      multiple: false,
      headers: uploadHeaders,
      showUploadList: { showDownloadIcon: false },
      fileList: value,
      onChange: this.fileChange,
      action: '/task/UploadCalleeFile.json',
      ...restProps
    };
    return (
      <Upload.Dragger {...uploadProps} style={{ ...style }}>
        <div
          className={styles.draggerCom}
          style={{ height: _.get(style, 'height') || 90 }}>
          <p>
            <Icon
              type="plus-circle"
              style={{ fontSize: '18px', marginRight: '8px', color: '#337CDB' }}
            />
            {text || '上传'}
          </p>
          {placeholder && <p className="dragger-placeholder">{placeholder}</p>}
        </div>
      </Upload.Dragger>
    );
  }
}

export default DraggerUpload;
