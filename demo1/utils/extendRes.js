var path = require('path');
var fs = require('fs')
var ejs = require('ejs')

function handleRes(res, { data, header, httpCode = 200 }) {
    res.writeHead(httpCode, { ...header });
    res.write(data);
    res.end();
}

module.exports = function (res) {
    res.json = function (data) {
        try {
            data = JSON.stringify(data)
            handleRes(res, { data, header: { 'Content-Type': 'application/json' } })
        } catch (e) {
            handleRes(res, { data: e.message || 'parse json error', httpCode: 500 })
        }
    }

    res.text = function (data) {
        handleRes(res, { data })
    }

    res.handle = function (data, {header, httpCode} = {}) {
        handleRes(res, { data, header, httpCode })
    }

    res.file = function (fileName) {
        fs.readFile(fileName, {}, (err, data) => {
            if (err) {

                handleRes(res, { data: (err.message || 'read file error'), httpCode: 500 })
            } else {
                handleRes(res, { data })
            }
        })
    }

    res.view = function (pathname, data) {
        let xPath = path.join(global.rootDir, 'view', `${pathname}.ejs`)
        let header = {}
        ejs.renderFile(xPath, { ...data }, {}, function (err, data) {
            if (err) {
                handleRes(res, { data: err.message || 'ERR', header, httpCode: 500 })
                return;
            }

            header["Content-Type"] = "text/html;charset=UTF-8"

            handleRes(res, { data, header })
        });
    }
}