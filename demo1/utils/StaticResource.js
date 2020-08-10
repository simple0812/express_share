let fs = require("fs");
let path = require("path");
let _ = require("lodash");
let qs = require("query-string");

class StaticResource {
  constructor() {
    this.dirs = [];
  }

  regist = (dirName) => {
    if (!dirName || !_.isString(dirName)) {
      return;
    }

    this.dirs.push(dirName);
  };

  match = (req, res, next) => {
    let xUrl = req.url.split("?");
    let xPathname = xUrl[0];
    let xQuery = qs.parse(xUrl[1] || "");

    let xPath = "";

    let xIndex = _.findIndex(this.dirs, (each) => {
      xPath = path.join(each, xPathname);

      return fs.existsSync(xPath) && fs.statSync(xPath).isFile();
    });

    let xType = {
      js: "application/javascript",
      css: "text/css",
      html: "text/html",
      htm: "text/html",
    };

    if (xIndex >= 0) {
      let ext = path.extname(xPath).slice(1);

      let header = {};

      if (xType[ext]) {
        header = { "content-type": xType[ext] };
      }

      res.writeHead(200, { ...header });
      res.write(fs.readFileSync(xPath));
      res.end();

      // 匹配成功了 不需要交出控制权
      return true;
    }

    // 添加单页应用路由
    res.writeHead(200, { "content-type": "text/html" });
    if (fs.existsSync(path.join(this.dirs[0], "index.htm"))) {
      res.write(fs.readFileSync(path.join(this.dirs[0], "index.htm")));
    } else {
      res.write(fs.readFileSync(path.join(this.dirs[0], "index.html")));
    }
    res.end();

    if (_.isFunction(next)) {
      // next(null)
    }
  };
}

module.exports = StaticResource;
