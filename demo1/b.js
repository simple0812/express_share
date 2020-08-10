/**
 * 实现简单路由
 * 实现输出 text json file
 * 实现 服务端渲染页面
 */

var http = require("http");
var qs = require("query-string");
var fs = require("fs");
var ejs = require("ejs");
var _ = require("lodash");
const { userInfo } = require("os");

http
  .createServer(function (req, res) {
    let xUrl = req.url.split("?");
    let xPathname = xUrl[0];
    let xQuery = qs.parse(xUrl[1] || "");

    let header = {
      "Content-Type": "text/plain",
    };

    switch (xPathname) {
      case "/hello":
        {
          res.writeHead(200, { ...header });
          res.write("hello world");
          res.end();
        }
        break;

      case "/text":
        handleRes(req, res, { data: "hello word text" });
        break;
      case "/json":
        handleRes(req, res, {
          data: JSON.stringify({ type: "json", params: xQuery }),
          header: { "Content-Type": "application/json" },
        });
        break;

      case "/file":
        handleRes(req, res, {
          data: fs.readFileSync("./files/res.html"),
          header: { "Content-Type": "text/html;charset=UTF-8" },
        });
        break;

      case "/image":
        handleRes(req, res, { data: fs.readFileSync("./files/1.jpg") });
        break;

      case "/pipe":
        fs.createReadStream("./files/1.jpg").pipe(res);
        break;
      case "/view":
        {
          let nickName = xQuery.nickName || "未知";
          let fullName = xQuery.fullName || "未知";

          ejs.renderFile(
            "./view/index.ejs",
            { dataSource: { nickName, fullName }, userInfo: null },
            {},
            function (err, data) {
              if (err) {
                handleRes(req, res, {
                  data: err.message || "ERR",
                  header,
                  httpCode: 500,
                });
                return;
              }

              header["Content-Type"] = "text/html;charset=UTF-8";

              handleRes(req, res, { data, header });
            }
          );
        }
        break;
      default:
        handleRes(req, res, { data: "404 not found", httpCode: 404 });
        break;
    }
  })
  .listen("8080");

function handleRes(req, res, { data, header, httpCode = 200 }) {
  res.writeHead(httpCode, { ...header });
  res.write(data);
  res.end();
}
