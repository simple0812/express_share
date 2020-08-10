var express = require('express');
var config = require('../config');
var router = express.Router();
var ctrl = require('../controllers/blog');

router.get('/', ctrl.redirect);
router.get('/blog', ctrl.render);

module.exports = router;