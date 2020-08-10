import { get, post } from '@/service/xhr/fetch';
import _ from 'lodash';

export function getFn(url) {
  return function (...params) {
    return get(url, ...params);
  };
}

export function postFn(url) {
  return function (...params) {
    return post(url, ...params);
  };
}

export default class BaseService {
  constructor(moduleName = '', apiMap = {}) {
    this.moduleName = moduleName;
    /**
     * url: fn || string  请求地址
     * method: string  请求方法
     * formatParams: fn  参数调整
     */
    this.apiMap = {
      // getList: `/${moduleName}/getList`, // 字符串表示只配置url了字段 method使用默认的配置(获取数据使用get 增删改使用post)
      // getDetail: {url: `/${moduleName}/getDetail`, method:'get', formatParams: ''},

      // create:`/${moduleName}/create`,
      // update:`/${moduleName}/update`,
      // multiUpdate:`/${moduleName}/update`,
      // delete:`/${moduleName}/delete`,
      // multiDelete: {url: `/${moduleName}/delete`, method:'post', formatParams: ''},
      ...apiMap
    };
    this.methodMap = {
      get: get,
      post: post
    };

    this.init();
  }

  init = () => {
    _.keys(this.apiMap).forEach((key) => {
      if (!this[key]) {
        if (_.isFunction(this.apiMap[key])) {
          this[key] = this.apiMap[key];
        } else {
          this[key] = (params) => {
            return this.handleRequest(key, params);
          };
        }
      }
    });
  };

  getApi(type = '', params) {
    let xApi = this.apiMap[type] || '';
    if (_.isString(xApi)) {
      return {
        url: xApi
      };
    }

    if (_.isFunction(xApi.url)) {
      return {
        url: xApi.url(params),
        formatParams: xApi.formatParams || ''
      };
    }

    return xApi;
  }

  handleRequest = (type, params) => {
    let xApi = this.getApi(type, params) || {};
    let reqMethod = get;
    //
    if (xApi.method) {
      reqMethod = this.methodMap[xApi.method.toLocaleLowerCase()] || get;
    } else {
      if (
        type === 'create' ||
        type === 'update' ||
        type === 'multiUpdate' ||
        type === 'remove' ||
        type === 'multiRemove'
      ) {
        reqMethod = post;
      }
    }

    let xParams = { ...params };
    if (_.isFunction(xApi.formatParams)) {
      xParams = xApi.formatParams({ ...params });
    }
    return reqMethod(xApi.url || '', xParams);
  };
}
