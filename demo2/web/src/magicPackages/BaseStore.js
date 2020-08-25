import { observable, flow, extendObservable, isObservableProp } from 'mobx';
import message from '@/components/Message';
import _ from 'lodash';
import axios from 'axios';
const CancelToken = axios.CancelToken;

class BaseStore {
  @observable
  globalLoading = {}; // 全局loading

  constructor(service, methods) {
    this.service = service;
    this.cancellers = {};
    // {getList:{serviceMethodName: 'getList', service: null, observableProp: 'list'， successMessage： 'string or fn(params, resData)'},}
    this.methods = {
      ...methods
    };

    this.init();
  }

  /* 1.默认读取service的apiMap 为其中的所有方法自动创建store对应的方法
    2.如果方法需要添加一些属性(如observableProp、successMessage：) 请在this.methods中显式配置
 */
  init = () => {
    let xMethods = {};
    _.keys(this.service.apiMap || {}).forEach((key) => {
      xMethods[key] = { serviceMethodName: key };
    });

    let tMethods = {
      ...xMethods,
      ...this.methods
    };

    let xVals = _.values(tMethods);

    // 动态添加 observable props
    (xVals || []).forEach((each) => {
      try {
        if (
          each.observableProp &&
          !isObservableProp(this, each.observableProp)
        ) {
          extendObservable(this, {
            [each.observableProp]: null
          });
        }
      } catch (e) {}
    });

    let xKeys = _.keys(tMethods) || [];

    for (let i = 0; i < xKeys.length; i++) {
      let methodName = xKeys[i];

      // 如果存在同名方法 则跳过
      if (_.isFunction(this[methodName])) {
        continue;
      }

      this[methodName] = this.flowWithLoading.call(
        this,
        methodName,
        // eslint-disable-next-line
        function* gen(...args) {
          let temp = tMethods[methodName] || {};
          let sMethod = temp.serviceMethodName || methodName;
          if (_.isFunction(sMethod)) {
            throw new Error(`${methodName} service.${sMethod} is not function`);
          }

          // 暂不支持取消
          // if (temp.cancelable) {
          //   this.cancelRequest(this.cancellers[methodName]);

          // }

          let xService = temp.service || this.service;

          const res = yield xService[sMethod](...args);
          let { code, data, message: msg } = res || {};

          // 响应异常
          if (+code !== 200) {
            throw new Error(`Response Exception: ${msg};code: ${code}`);
          }

          if (temp.observableProp) {
            this[temp.observableProp] = data;
          }

          // 提示信息
          if (temp.successMessage) {
            if (_.isFunction(temp.successMessage)) {
              message.success(temp.successMessage(data, ...args));
            } else {
              message.success(temp.successMessage);
            }
          }

          return res;
        }
      );
    }
  };

  cancelRequest(cancel) {
    if (typeof cancel === 'function') {
      cancel();
    }
  }

  flowWithLoading = (effectName, gen) => {
    // 函数重载 如果只有传入了生成器函数
    if (
      Object.prototype.toString.call(effectName) ===
      '[object GeneratorFunction]'
    ) {
      gen = effectName;
      effectName = 'default';
    }

    effectName = effectName || 'default';
    let _this = this;
    return flow(function* genex(...args) {
      if (_.isObject(_this.globalLoading)) {
        _this.globalLoading = Object.assign({}, _this.globalLoading, {
          [effectName]: 'pending',
          [`${effectName}Error`]: ''
        });
      }

      try {
        const data = yield* gen.call(_this, ...args);

        if (_.isObject(_this.globalLoading)) {
          _this.globalLoading = Object.assign({}, _this.globalLoading, {
            [effectName]: 'done',
            [`${effectName}Error`]: ''
          });
        }

        return data;
      } catch (e) {
        if (_.isObject(_this.globalLoading)) {
          _this.globalLoading = Object.assign({}, _this.globalLoading, {
            [effectName]: 'error',
            [`${effectName}Error`]: e.message || '操作失败'
          });
        }
      }
    });
  };
}

export default BaseStore;
