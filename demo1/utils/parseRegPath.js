let _ = require("lodash");

function parseRegPath(pathname, regPath) {
  let reg = /\/:[^/]+/g
  let tMatch = regPath.match(reg);


  if (!tMatch || !tMatch.length) {
    return null;
  }

  let ret = {};
  let xReg = regPath.replace(reg, () => '/([^/]+)')

  let x = pathname.match(new RegExp('^' + xReg + '$'))
  if (!x) {
    return null;
  }

  for(let i = 0; i< tMatch.length; i++) {
    let key = tMatch[i].slice(2);
    let val =  RegExp[`$${i +1}`]

    if (_.isUndefined(val) || val === '') {
      return null;
    }

    ret[key] = val;
  }

  return ret;
}

module.exports = parseRegPath

// let ret = parseRegPath('/reg/zl', '/reg/:name')