import React, { Component } from 'react';
import styles from './index.less';
import Debounce from 'lodash-decorators/debounce';
import Announcement from './Announcement';
import Options from './Options';
import { Link } from 'react-router-dom';
import logo from '@/assets/img/logo.png';
import logo2 from '@/assets/img/logo2x.png';

import logoNew from '@/assets/img/logo-new.png';
import logoNew2 from '@/assets/img/logo-new@2x.png';
import Cookies from 'js-cookie';

export default class GloabalHeader extends Component {
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    let isFromShowCenter = !!Cookies.get('SPE');
    let logoStyle = {};
    if (isFromShowCenter) {
      logoStyle = { fontSize: 20, fontWeight: 600 };
    }

    return (
      <div className={styles.header}>
        <div className={styles.logo} id="logo">
          <Link to="/">
            {
              <div style={logoStyle}>
                {isFromShowCenter ? (
                  <img
                    src={logoNew}
                    srcSet={`${logoNew2} 2x`}
                    alt="logo"
                    style={{ width: 30, height: 30, marginRight: 16 }}
                  />
                ) : (
                  <img src={logo} srcSet={`${logo2} 2x`} alt="logo" />
                )}
                效能监察系统
              </div>
            }
          </Link>
        </div>
        <Options />
        <div></div>
      </div>
    );
  }
}
