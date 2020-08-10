var _ = require('lodash')

// 前一个结果作为参数传给下一个
function asyncjs(workflow, cb) {
    if (!_.isArray(workflow)) {
        return;
    }


    let firstFn = workflow[0];

    if (!_.isFunction(firstFn)) {
        return;
    }


    let nextIndex = 1;

    function handleNext() {
        let nextFn = workflow[nextIndex];
        return function (err, data) {
            if (err) {
                cb(err)
                return
            } else {
                if (_.isFunction(nextFn)) {
                    nextIndex += 1;
                    nextFn(data, handleNext())
                } else {
                    cb(null, data);
                }
            }
        }
    }

    firstFn({}, handleNext())
}

// 传递相同的参数
function asyncWith(...params) {
    return function (workflow, cb) {
        if (!_.isArray(workflow)) {
            return;
        }


        let firstFn = workflow[0];
        let nextIndex = 1;

        function handleNext() {
            let nextFn = workflow[nextIndex];
            return function (err, data) {
                if (err) {
                    cb(err)
                    return
                } else {
                    if (_.isFunction(nextFn)) {
                        nextIndex += 1;
                        nextFn(...params, handleNext())
                    } else {
                        cb(null, data);
                    }
                }
            }
        }

        firstFn(...params, handleNext())
    }
}

module.exports = {
    asyncjs,
    asyncWith
}
