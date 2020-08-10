var path = require('path');
var fsx = require('fs-extra');

fsx.ensureDir(path.resolve(__dirname, '../../uploads') + '/appxs');
fsx.ensureDir( path.resolve(__dirname, '../database'));

module.exports = {
  ROOT: path.resolve(__dirname, '../'),
  PORT: 8080,
  FILE_DIR: path.resolve(__dirname, '../../files'),
  LOG_DIR: path.resolve(__dirname, '../../logs'),
  UPLOAD_DIR: path.resolve(__dirname, '../../uploads'),
  SQLITE_DB:  path.resolve(__dirname, '../database/sqlite.db'),
  APPX_DIR: path.resolve(__dirname, '../../uploads') + '/appxs',
  DB: {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'blog'
  }
};