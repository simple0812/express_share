import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import styles from './index.less';
import Debounce from 'lodash-decorators';
import Scrollbars from 'react-custom-scrollbars';
import menuIcons from './MenuIcon';
const { SubMenu } = Menu;
const { Sider } = Layout;

const getIcon = (icon) => {
  const menuIcon = menuIcons[icon];
  if (menuIcon) {
    return (
      <img
        src={menuIcon.normal}
        alt="icon"
        srcSet={`${menuIcon.emphasis} 2x`}
        className={styles.icon}
      />
    );
  }
  return <Icon type={icon} />;
};

export default class SideMenu extends Component {
  createItem = (list) => {
    return list.map((item, key) => {
      return (
        <Menu.Item key={item.path}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      );
    });
  };

  menu(path) {
    this.props.update(path);
  }

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
    const { routers, routeMap, collapsed } = this.props;
    let pathname = window.location.hash.substr(1);
    const menuKey = Object.keys(routeMap).find((key) => {
      const reg = new RegExp(`${key}.*`);
      return reg.test(pathname);
    });
    if (menuKey) {
      const menuReg = menuKey.split('').reverse().join('');
      const reg = new RegExp(`.*(?=${menuReg})`);
      pathname = pathname
        .split('')
        .reverse()
        .join('')
        .replace(reg, '')
        .split('')
        .reverse()
        .join('');
    }
    const curRoute = routeMap[pathname] || [];
    const route = curRoute.find((item) => item.path) || {};
    const { superKey = '' } = route;
    return (
      <Sider
        className={styles.sider}
        trigger={null}
        width={200}
        collapsible
        collapsed={collapsed}>
        <Scrollbars
          style={{
            height: 'calc(100vh - 113px)'
          }}
          autoHide={true}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={[superKey]}
            className={styles.sliderMenu}>
            {routers.map((item, key) => {
              const { children = [], show = true } = item;
              if (show) {
                if (children.length > 0) {
                  return (
                    <SubMenu
                      key={item.key}
                      title={
                        <span>
                          {getIcon(item.icon)}
                          {!collapsed ? item.label : ''}
                        </span>
                      }>
                      {this.createItem(children)}
                    </SubMenu>
                  );
                }
                return (
                  <Menu.Item key={item.path}>
                    <Link to={item.path}>
                      {getIcon(item.icon)}
                      <span>{item.label}</span>
                    </Link>
                  </Menu.Item>
                );
              }

              return '';
            })}
          </Menu>
        </Scrollbars>

        <div className={styles.trigger}>
          <Icon
            style={{ fontSize: 16, color: '#fff' }}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        </div>
      </Sider>
    );
  }
}
