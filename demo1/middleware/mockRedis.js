
var fs = require('fs');
var path = require('path');
var _ = require('lodash')

module.exports = function(req, res, next) {

  fs.readFile(path.join(global.rootDir, 'middleware/data'), {}, function(err, data) {
  	if(!err) {
  		let xData = data.toString('utf8');
  		try {
  			xData = JSON.parse(xData);
  		} catch(e) {}
  		res.userInfo = xData;
  	} else {
  		console.log('getUserInfo error', err.message)
  	}

  	if (_.isFunction(next)) {
      next()
    }
  })
  
}