import React, { Component } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import stores from './stores';
import { fetchToken } from '@/service/xhr/fetch';
import Home from '@/containers/Home';

import './index.less';
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const routers = [
      {
        key: '/',
        path: '/',
        extra: true,
        render: Home
      }
    ]
    return (
      <Provider {...stores}>
        <Router>
          <ConfigProvider locale={zhCN}>
            <Switch>
              {routers.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.render}
                />
              ))}
            </Switch>
          </ConfigProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
