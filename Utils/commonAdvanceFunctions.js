
const async = require('async');

function advancedFunctions() {}

function indexingAnArrayAndCreateObject(array, index) {


    var newObject = {};
    array.forEach(function(arrayObject) {
        newObject[arrayObject[index]] = arrayObject;
    });
    return newObject
}

advancedFunctions.prototype.indexingAnArrayAndCreateObject = indexingAnArrayAndCreateObject;

advancedFunctions.prototype.inherits = function(Child, Parent) {
    var Tmp_ = function() {};
    Tmp_.prototype = Parent.prototype;
    Child.prototype = new Tmp_();
    Child.prototype.constructor = Child;
}


advancedFunctions.prototype.checkingMongoDbErrors = function(mongoError) {

    var message = mongoError.message

    if (message.indexOf('duplicate key') > -1) {

        var error = {
            statusCode: 400,
            success: false,
            customMessage: message.substring(message.indexOf('$') + 1, message.indexOf('_')) + ' Already Exists',
            type: message.substring(message.indexOf('$') + 1, message.indexOf('_')).toUpperCase() + '_ALREADY_EXIST'
        }
        return error
    }
    return -1;
}


function waterFallHandler(err, response) {
    if (err) {
        this.callback(err);
    } else {
        this.callback(null, response);
    }
}

function handleWaterFallFunctions(waterfallArray, callback) {

    async.waterfall(waterfallArray, waterFallHandler.bind({
        callback: callback
    }));
}

advancedFunctions.prototype.handleWaterFallFunctions = handleWaterFallFunctions;

function handleParallelFunctions(parallelArray, callback) {

    async.parallel(parallelArray, waterFallHandler.bind({
        callback: callback
    }));

}


advancedFunctions.prototype.handleParallelFunctions = handleParallelFunctions;

Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function(parent) {
    this.prototype = new parent();
    var d = {},
        p = this.prototype;
    this.prototype.constructor = parent;
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, r, t = d[name],
            v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    });
    return this;
});

module.exports = new advancedFunctions();