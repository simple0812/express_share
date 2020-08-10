
var fs = require('fs');
var ejs = require('ejs');
var path = require('path')

module.exports = function (route) {
    route.get('/hello', (req, res) => {
        res.text('hello world')
    })

    route.get('/json', (req, res) => {
        res.json({
            type: 'json',
            query: req.query
        })
    })

    route.get('/file', (req, res) => {
        res.file(path.join(global.rootDir, '/files/hello.txt'))
    })

    route.get('/image', (req, res) => {
        res.file(path.join(global.rootDir, '/files/1.jpg'))
    })

    route.get('/view', (req, res) => {
        let nickName = req.query.nickName || '未知';
        let fullName = req.query.fullName || '未知';
        res.view('index', { dataSource: { nickName, fullName }, userInfo: res.userInfo })
    })

    route.get('/api/:id', (req, res) => {
        res.json(req.params)
    })

    route.get('/api/:id/:name', (req, res) => {
        res.json(req.params)
    })
}
