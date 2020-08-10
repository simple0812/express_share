module.exports = (function() {
  function Constructor(status, message, result) {
    this.code = status;
    this.message = message;
    this.data = result;
    this.success = status === 200;
  }

  function getError(err) {
    return new Constructor(0, err.message || err, '');
  }

  function getSuccess(docs) {
    return new Constructor(200, '', docs);
  }

  function pageSuccess(doc, allCount) {
    var json = new Constructor(200, '', doc);
    json.totalCount = allCount;
    return json;
  }

  return {
    getError: getError,
    getSuccess: getSuccess,
    pageSuccess: pageSuccess
  };

})();