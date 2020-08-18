var express = require('express');
var router = express.Router();
var ctrl = require('../api/v1/blog');
const jsonHelper = require('../utils/jsonHelper');

// 要么响应请求 要么移交控制权
function getpermission(req, res, next) {
    setTimeout(function() {
        req.isGuest = !!+req.query.guest;
        next();
    })
} 

function guest(req, res, next) {
    if (req.isGuest) {
        res.json(jsonHelper.getError('普通用户无权访问'))
    } else {
        next();
    }
}

router.get('/blog/getList', getpermission, guest, ctrl.page);
router.post('/blog/create', ctrl.create);
router.post('/blog/update', ctrl.update);
router.post('/blog/remove', ctrl.remove);
router.get('/blog/getDetail', ctrl.getDetail);

module.exports = router;