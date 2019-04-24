var UniversalFunctions = require('../Utils/UniversalFunctions');
var constant = require('../constant');
var async = require('async');

function ServiceModule(model) {
    this.model = model;
}

var add = function(objToSave, callback) {
    new this.model(objToSave).save(

        function(err, result) {
            if (err) {

                var modifiedError = UniversalFunctions.advancedFunctions.checkingMongoDbErrors(err);
                if (modifiedError != -1) {
                    return callback(modifiedError)
                }
            }
            callback(err, result)
        })
};

ServiceModule.prototype.add = add;

var insertMany = function(objsToSave, callback) {

    var seriesArray = [];
    var _this = this;


    objsToSave.forEach(function(objToSave) {

        seriesArray.push(function(cb) {
            new _this.model(objToSave).save(cb)
        });
    })
    async.series(seriesArray, callback)
}

ServiceModule.prototype.insertMany = insertMany;



var view = function(criteria, projection, options, callback) {

    var population = criteria.population;

    delete criteria.population
    var query = this.model.find(criteria, projection, options);

    if (population) {
        query.populate(population)
    }
    
    query.exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }
        callback(err, result);
    });


}

ServiceModule.prototype.view = view;


var findOne = function(criteria, projection, options, callback) {

    var population = criteria.population;

    delete criteria.population
    var query = this.model.findOne(criteria, projection, options);
    if (population) {

        query.populate(population)
    }
    query.exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }
        callback(err, result);
    });
}

ServiceModule.prototype.findOne = findOne;


var dataTable = function(query, options, callback) {

    this.model.dataTable(query, query.criteria, callback);

};
ServiceModule.prototype.dataTable = dataTable;


var edit = function(criteria, dataToSave, options, callback) {
    this.model.findOneAndUpdate(criteria, dataToSave, options, function(err, doc) {
        if (err) {
            // console.log(err)
            return callback(err);
        }

        callback(err, doc)
    });
}
ServiceModule.prototype.edit = edit;

var multiEdit = function(criteria, dataToSave, options, callback) {
    this.model.update(criteria, dataToSave, options, function(err, doc) {
        if (err) {
            console.log(err)
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }
        callback(err, doc)
    });
}
ServiceModule.prototype.multiEdit = multiEdit;


function remove(criteria, callback) {
    this.model.remove(criteria, function(err, result) {
        if (err) {
            console.log(err)
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }
        callback(err, result);
    });
}

ServiceModule.prototype.remove = remove;

function count(criteria, callback) {
    this.model.count(criteria, callback);
}
ServiceModule.prototype.count = count;


var viewDistinct = function(field, criteria, options, callback) {

    var population = criteria.population;

    delete criteria.population
    var query = this.model.find(criteria, {}, options).distinct(field);

    query.exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }

        callback(err, result);
    });
}

ServiceModule.prototype.viewDistinct = viewDistinct;

var aggregate = function(query, population, populationModel, callback) {

    this.model.aggregate(query).exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }

        if (population) {

            var Models = require('../Models');

            Models[populationModel].populate(result, population, callback);
        } else {
            return callback(err, result);
        }
    });
}

ServiceModule.prototype.aggregate = aggregate;

exports.ServiceModule = ServiceModule;