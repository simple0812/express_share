var Blog = require('./blog');
var config = require('../config');

var db = require('./db');
var rootdb = require('./rootdb');

exports.Blog = Blog;
exports.db = db;
exports.syncDb = function() {

  // return db.sync();

  // mysql初始化的时候 需要连接默认数据库来创建新的数据库
  return rootdb.query(`CREATE DATABASE IF NOT EXISTS ${config.DB.database} CHARSET utf8`, { raw: true })
  .then(() => {
    return db.sync();
  });
};