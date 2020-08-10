
var  {asyncWith, asyncjs} = require('../utils/async')
var _ =require('lodash')

function foo(params, cb) {
    console.log('fo', params, cb)
    setTimeout(function () {
        if (_.isFunction(cb)) {
            console.log('foo')
            cb(null, 'foo')
        }
    })
}

function bar(params, cb) {
    setTimeout(function () {
        if (_.isFunction(cb)) {
            console.log('bar')
            cb(null, 'bar')
        }
    })
}

function baz(params, cb) {
    setTimeout(function () {
        if (_.isFunction(cb)) {
            console.log('baz')
            cb(null, 'baz')
        }
    })
}

// asyncjs([foo, bar, baz], (err, data) => {
//     if (err) {
//         console.log('errrr', err.message || err)
//     } else {
//         console.log('done', data)
//     }
// })

asyncWith('111')([foo, bar, baz], (err, data) => {
    if (err) {
        console.log('errrr', err.message || err)
    } else {
        console.log('done', data)
    }
})