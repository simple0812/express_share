function isPromise(fn) {
    // return !!fn.then && !!fn.catch;
    return Object.prototype.toString.call(fn) === "[object Promise]"
}

function isGenerator(fn) {
    return  Object.prototype.toString.call(fn) ===
    '[object GeneratorFunction]'
}

function co(gen) {
    if (!isGenerator(gen)) {
        return;
    }
    let xGen = gen();

    next();

    function next(ret) {
        //next() 函数可以传入一个参数，作为上一个yeild 的返回值
        let xRet = xGen.next(ret);

        if (xGen.done) {
            return;
        }
    
        if (xRet.value && isPromise(xRet.value)) {
            xRet.value.then(res => {
                next(res);
            }).catch(err => {
                next(err)
            })
        } else {
            xGen.next(xRet.value + '_extra');
        }
    }
 
}

function promiseA() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('aaa')
        }, 1000)
    })
}

function promiseB() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('bbb')
        }, 1000)
    })
}

co(function * () {
    let a = yield promiseA();
    console.log('a===>', a)
    let b = yield promiseB();
    console.log('b===>', b)
    let c = yield 'c';
    console.log('c===>', c)
})