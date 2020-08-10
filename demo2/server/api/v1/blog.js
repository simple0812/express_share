var _ = require("lodash");
var Sequelize = require("sequelize");
var moment = require('moment');
var jsonHelper = require("../../utils/jsonHelper");
var logger = require("../../utils/logger");

var models = require("../../models");

exports.page = async function (req, res) {
  let query = req.query || {};

  console.log('qeury', req.query)
  var pageSize = +query.pageSize || 10;
  var pageIndex = +query.pageIndex || 1;
  var firNum = (pageIndex - 1) * pageSize;
  var title = query.title || "";
  var author = query.author || "";
  var queryBeginDate = query.queryBeginDate;
  var queryEndDate = query.queryEndDate;

  var xquery = {
    limit: pageSize,
    offset: firNum,
    raw: true,
    where: {},
  };

  if (title.trim()) {
    xquery.where.title = { [Sequelize.Op.like]: "%" + title + "%" };
  }

  if (author.trim()) {
    // xquery.where.author = { [Sequelize.Op.like]: "%" + author + "%" };
    xquery.where.author = author;

  }
  if (queryBeginDate && queryEndDate) {
    xquery.where.created_at = {$between:[moment(`${queryBeginDate} 00:00:00`).valueOf(), moment(`${queryEndDate} 23:59:59`).valueOf()]}
  }

  try {
    let result = await models.Blog.findAndCountAll(xquery);

    var docs = result.rows;
    var count = result.count;
    res.json(jsonHelper.pageSuccess(docs, count));
  } catch (e) {
    res.json(jsonHelper.getError(err.message));
  }
};

exports.create = function (req, res) {
  var p = req.body;
  if (!p || !_.keys(p).length) {
    return res.json(jsonHelper.getError("data is empty"));
  }

  if (!p.title) {
    return res.json(jsonHelper.getError("title is empty"));
  }

  if (!p.summary) {
    return res.json(jsonHelper.getError("summary is empty"));
  }

  p.id = p.id || null;

  models.Blog.upsert(p)
    .then((doc) => {
      res.json(jsonHelper.getSuccess(p));
    })
    .catch((err) => {
      res.json(jsonHelper.getError(err.message));
    });
};

exports.update = function (req, res) {
  var p = req.body;
  if (!p || !_.keys(p).length) {
    return res.json(jsonHelper.getError("data is empty"));
  }

  if (!p.title) {
    return res.json(jsonHelper.getError("title is empty"));
  }

  if (!p.summary) {
    return res.json(jsonHelper.getError("summary is empty"));
  }

  if (!p.id) {
    return res.json(jsonHelper.getError("id is empty"));
  }

  models.Blog.upsert(p)
    .then((doc) => {
      res.json(jsonHelper.getSuccess(doc));
    })
    .catch((err) => {
      res.json(jsonHelper.getError(err.message));
    });
};

exports.remove = function (req, res) {
  var p = req.body || {};

  if (_.isEmpty(p.id)) {
    return res.json(jsonHelper.getError("data is emtpy"));
  }
  let ids = p.id.split(",").map((each) => +each);
  models.Blog.destroy({ where: { id: { [Sequelize.Op.in]: ids } } })
    .then((doc) => {
      res.json(jsonHelper.getSuccess(doc));
    })
    .catch((err) => {
      res.json(jsonHelper.getError(err.message));
    });
};

exports.baz = function (req, res) {
  res.json(jsonHelper.getSuccess("baz"));
};


exports.re = function(req, res) {
  res.redirect('/ve')
}

exports.ve = function(req, res) {
  res.text
}