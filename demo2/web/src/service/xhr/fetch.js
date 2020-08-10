import axios from 'axios';
import message from '@/components/Message';
import qs from 'qs';
import _ from 'lodash';
import { isEmpty } from '@/utils';
import Cookies from 'js-cookie';

const BASE_URL = `http://${window.location.hostname}:8080`; //window.location.origin;
/**
 * 创建xhr实例
 * 路径前缀
 * 超时失败时间
 */
const service = axios.create({
  baseURL: BASE_URL,
  timeout: 500000
});

const queryTokenParam = {
  username: 'admin',
  password: '1qaz12@WSX',
  grant_type: 'password',
  scope: 'profile',
  client_id: '00000000-0000-0000-0000-000000000000',
  client_secret:
    'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
};

/**
 * 同步请求
 * @param {*} url
 * @param {*} param
 * @param {*} callback
 */
const postSync = (url, param, callback) => {
  var request = new XMLHttpRequest();
  request.open('POST', url, false);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.onreadystatechange = function () {
    if (!request || request.readyState !== 4) {
      return;
    }
    if (
      request.status === 0 &&
      !(request.responseURL && request.responseURL.indexOf('file:') === 0)
    ) {
      return;
    }
    var responseData = request.response;
    try {
      responseData = JSON.parse(responseData);
    } catch (e) {
      responseData = responseData; // eslint-disable-line
    }
    var response = {
      response: responseData,
      status: request.status,
      statusText: request.statusText
    };
    callback(response);
    request = null;
  };
  request.onerror = function handleError() {
    // Real errors are hidden from us by the browser
    // onerror should only fire if it's a network error
    callback(request);
    // Clean up request
    request = null;
  };
  request.ontimeout = function (e) {
    message.error('token获取异常');
    callback({});
  };

  request.send(qs.stringify(param));
};

/**
 * 由于预发环境使用oauth机制，在开发环境通过调用联通接口，获取token，这样就可以在开发环境调用预发的接口
 */
export const fetchToken = () => {
  postSync('/oauth/token', queryTokenParam, (res) => {
    const { response = {} } = res;
    const { access_token } = response;
    window.authToken = access_token;
  });
};

/**
 * @desc 设置服务请求拦截器
 * 定义token请求设置
 */
service.interceptors.request.use(
  (config) => {
    // if(window.authToken){
    //     config.headers.Authorization = `Bearer ${window.authToken}`
    // }
    let SPE = Cookies.get('SPE');

    if (SPE) {
      config.headers.Authorization = `Bearer ${SPE}`;
    } else if (window.authToken) {
      config.headers.Authorization = `Bearer ${window.authToken}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

/**
 * @desc 设置服务响应拦截器
 * 截取返回状态 统一定义成功失败
 */
service.interceptors.response.use(
  (response) => {
    const { isCustomException = false } = response.config;
    const data = response.data;
    const type = Object.prototype.toString.call(data);
    if (type === '[object Object]') {
      const { code, success, message: msg } = data;
      if (code == 200 && success) {
        return Promise.resolve(data);
      } else if (code == 400 || code == 401) {
        window.location = '/exit';
      } else {
        if (!isCustomException) {
          // 如果走自定义异常提示
          message.error(msg);
        }
        return Promise.reject(data);
      }
    } else if (type === '[object String]' && /^<!doctype/.test(data)) {
      // 需要重定向
      window.location.reload();
    } else {
      return Promise.reject(data);
    }
  },
  (error) => {
    const { response } = error;
    console.log('err' + error);
    message.error(String(error));
    return Promise.reject(error);
  }
);

function handleParam(param = {}) {
  const retParam = {};
  Object.keys(param).forEach((key) => {
    if (!isEmpty(param[key])) {
      retParam[key] = param[key];
    }
  });

  return qs.stringify(retParam);
}

const get = (url, params = {}, isCustomException = false) => {
  params = handleParam(params);
  if (!isEmpty(params)) {
    url = url + '?' + params;
  }
  return service({
    url,
    method: 'get',
    isCustomException
  });
};

/**
 *
 * @param {*} url 请求路径
 * @param {*} data 请求参数
 * @param {*} isCustomException 是否启用自定义异常，如果为true，需要手动添加catch去处理异常，全局的异常提示不会显示
 */
const post = (url, data = {}, isCustomException = false) => {
  return service.post(url, qs.stringify(data), { isCustomException });
};

export { get, post, service };
export default service;
