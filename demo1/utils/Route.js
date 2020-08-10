
var _ = require('lodash');
var parseRegPath = require('./parseRegPath') 
// https://www.npmjs.com/package/path-to-regexp

var qs = require('query-string');


class Route {
  constructor(router) {
    this.normalRouter = {
      get: {},
      put: {},
      post: {},
      delete: {},
    }
    this.regRouter = {
      get: {},
      put: {},
      post: {},
      delete: {},
    }
  }

  registByMethod = (method, url, fn) => {
    let xRouter = url.indexOf(':') >= 0 ? this.regRouter : this.normalRouter;

    if (xRouter[method][url]) {
      console.warn(`${method} ${url} 被覆盖`)
    }
    xRouter[method][url] = fn;
  }

  get = this.registByMethod.bind(this, 'get')
  post = this.registByMethod.bind(this, 'post')
  put = this.registByMethod.bind(this, 'put')

  delete = (url, fn) => {
    this.registByMethod('delete', url, fn)
  }



  match = (req, res, next) => {
    let xUrl = req.url.split('?');
    let xPathname = xUrl[0];
    let xQuery = qs.parse(xUrl[1] || '');
    let xMethod = (req.method || 'get').toLocaleLowerCase();


    if (_.isFunction(this.normalRouter[xMethod][xPathname])) {
      req.query = xQuery;
      this.normalRouter[xMethod][xPathname](req, res)
      return true;
    }



    let xRegRouter = _.keys(this.regRouter[xMethod]);
    //正则匹配
    for (let i = 0; i < xRegRouter.length; i++) {
      let xKey = xRegRouter[i]

      /**
       * xPathname:  /foo/123
       * xKey:  /foo/:id
       * xParams  {id: 123}
       */
      let xParams = parseRegPath(xPathname, xKey);

      // 匹配到数据
      if (!_.isEmpty(xParams) && _.isFunction(this.regRouter[xMethod][xKey])) {
        req.params = xParams;
        this.regRouter[xMethod][xKey](req, res);
        return true;
      }
    }

    if (_.isFunction(next)) {
      next(null)
    }
  }
}

module.exports = Route;
