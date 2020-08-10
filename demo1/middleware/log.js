var _ = require('lodash')

module.exports = function(req, res, next) {
  res.__startTime = Date.now()
  let _resEnd = res.end;
  res.end = function(...args) {
  	let currTime = Date.now();
    _resEnd.apply(res, ...args);
    console.log(`${req.method} ${req.url} ${currTime-res.__startTime}ms`)
  }

  if (_.isFunction(next)) {
  	next()
  }
}