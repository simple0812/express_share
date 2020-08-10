
/**一个完整的web服务
 * 静态资源
 * 路由
 * 输出api
 * 服务端渲染
 */

var http = require('http');
var fs = require('fs');
var _ = require('lodash');
let path = require("path");

global.rootDir = __dirname;

//静态资源
var StaticResource =  require('./utils/StaticResource');
//路由组件
var Route =  require('./utils/Route');
var extendRes =  require('./utils/extendRes');

let route = new Route();
let staticResource = new StaticResource();

require('./router')(route);

staticResource.regist(path.join(__dirname, 'public'));


http.createServer(function (req, res) {
  //res扩展一些常用方法
  extendRes(res);

  if (staticResource.match(req, res)) {
    return;
  }

  if (route.match(req, res)) {
    return;
  }

  // 404 兜底
  res.handle('404 not found', { httpCode: 404 })

}).listen('8080')
