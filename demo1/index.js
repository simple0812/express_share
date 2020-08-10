
/**
 * 中间件 解析参数、输出日志等
 * 异步工作流控制
 */

var http = require('http');
var fs = require('fs');
var _ = require('lodash');
let path = require("path");

global.rootDir = __dirname;

var Route =  require('./utils/Route');
var StaticResource =  require('./utils/StaticResource');
var extendRes =  require('./utils/extendRes');
var log =  require('./middleware/log');
var mockRedis =  require('./middleware/mockRedis');

var  {asyncWith} = require('./utils/async')

let route = new Route();
let staticResource = new StaticResource();

require('./router')(route);

staticResource.regist(path.join(__dirname, 'public'));


let workflow = []
workflow.push(mockRedis);
workflow.push(log);
workflow.push(staticResource.match);
workflow.push(route.match);
  // 404 兜底
workflow.push(function(req, res) {
  res.handle('404 not found', { httpCode: 404 })
})


http.createServer(function (req, res) {
  //res扩展一些常用方法
  extendRes(res);
  asyncWith(req, res)(workflow, function(err) {
    if (err) {
      console.error('err', err.message || err )
    } else {
      console.log('done')
    }
  })

}).listen('8080')
