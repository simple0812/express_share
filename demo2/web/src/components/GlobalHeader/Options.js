import React, { Component } from 'react';
import styles from './index.less';
import { Icon, Popover } from 'antd';
import userLogo from '@/assets/img/user-avatar.jpg';
import { withRouter } from 'react-router-dom';
import morning from '@/assets/img/morning.png';
import morning2x from '@/assets/img/morning2x.png';
import evening from '@/assets/img/evening.png';
import evening2x from '@/assets/img/evening2x.png';
import afternoon from '@/assets/img/afternoon.png';
import afternoon2x from '@/assets/img/afternoon2x.png';
import night from '@/assets/img/night.png';
import night2x from '@/assets/img/night2x.png';

const mesasge = {
  morning: {
    img1: morning,
    img2: morning2x,
    text: '上午好，'
  },
  afternoon: {
    img1: afternoon,
    img2: afternoon2x,
    text: '下午好，'
  },
  night: {
    img1: night,
    img2: night2x,
    text: '晚上好，'
  },
  evening: {
    img1: evening,
    img2: evening2x,
    text: '夜深了，'
  }
};

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let time = new Date().getHours();
    let currentTime = 'evening';
    if (time >= 5 && time < 12) {
      currentTime = 'morning';
    } else if (time >= 12 && time < 17) {
      currentTime = 'afternoon';
    } else if (time >= 17 && time < 22) {
      currentTime = 'night';
    }
    const { img1, img2, text } = mesasge[currentTime];
    const content = (
      <span
        onClick={() => {
          window.location.href = '/exit';
        }}
        style={{ cursor: 'pointer' }}>
        <Icon type="logout" style={{ marginRight: 6 }} />
        退出登录
      </span>
    );
    return (
      <div className={styles.optionsContainer}>
        <span className={styles.userContainer}>
          <span className={styles.message}>
            <img src={img1} srcSet={`${img2} 2x`} alt="" />
            {text}
            <span title={window.REALNAME || window.YL_SCA_USER || '王二'}>
              {window.REALNAME || window.YL_SCA_USER || '王二'}
            </span>
          </span>
          <img src={userLogo} alt="" />
          <Popover
            content={content}
            title=""
            trigger="hover"
            placement="bottomRight">
            <Icon type="down" style={{ fontSize: 12, color: '#ADB6C2' }} />
          </Popover>
        </span>
      </div>
    );
  }
}

export default withRouter(Options);
