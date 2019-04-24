'use strict';

const controllerHelper = require('./commonControllerFunctions');
const UploadManager = require('../Lib/UploadManager');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const constant = require('../constant');
const config = require('config');

var ControllerModule = function(service) {
    this.service = service;
    this.debug = true;
}

ControllerModule.prototype.getFromService = function(data, callback) {

    data.criteria.isDeleted = {
        $ne: true
    }
    this.service.view(data.criteria, data.projection, data.options, callback);
}

ControllerModule.prototype.list = function(payloadData, callback) {

    var waterfallArray = [];
    waterfallArray.push(this.getFromService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};


ControllerModule.prototype.getGraph = function(data, callback) {

    this.graphOption.data = data;
    var chart = charts(this.graphOption);
    process.nextTick(callback.bind(null, null, chart));
}

ControllerModule.prototype.graph = function(payloadData, callback) {
    this.graphOption = payloadData.graphOption;

    var waterfallArray = [];
    waterfallArray.push(this.getFromService.bind(this, payloadData));
    waterfallArray.push(this.getGraph.bind(this));

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};

ControllerModule.prototype.listById = function(payloadData, callback) {

    var waterfallArray = [];
    waterfallArray.push(this.getFromService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {

        if (err) {
            return callback(err)
        }
        return callback(null, result[0])
    });
};

ControllerModule.prototype.addService = function(data, callback) {

    if (this.fakeDelete) {
        var criteria = {}

        this.uniqueKeys.forEach(function(key) {
            criteria[key] = data[key]
        });
        data.isDeleted = false;
        this.service.edit(criteria, data, { upsert: true, lean: true, new: true, setDefaultsOnInsert: true }, callback);

    } else {
        this.service.add(data, callback);
    }
}

ControllerModule.prototype.add = function(payloadData, callback) {

    var waterfallArray = [];

    if (this.imageUpload) {
        waterfallArray.push(this.uploadImage.bind(this, payloadData));
        waterfallArray.push(this.addService.bind(this));

    } else {
        waterfallArray.push(this.addService.bind(this, payloadData));
    }

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};



ControllerModule.prototype.editService = function(data, callback) {

    this.service.edit(data.criteria, data.projection, data.options, callback);
}

ControllerModule.prototype.multiEditService = function(data, callback) {

    this.service.multiEdit(data.criteria, data.projection, data.options, callback);
}


ControllerModule.prototype.edit = function(payloadData, callback) {

    var waterfallArray = [];


    if (this.imageUpload) {
        waterfallArray.push(this.uploadImage.bind(this, payloadData));
        waterfallArray.push(this.editService.bind(this));

    } else {
        waterfallArray.push(this.editService.bind(this, payloadData));
    }
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};


ControllerModule.prototype.multiEdit = function(payloadData, callback) {

    var waterfallArray = [];
    waterfallArray.push(this.multiEditService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};

ControllerModule.prototype.deleteService = function(data, callback) {

    if (this.fakeDelete) {
        this.service.edit(data.criteria, { isDeleted: true }, { lean: true }, function(err, result) {
            if (err) {
                return callback(err);
            }
            if (result == null) {
                return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID_PROVIDED)
            }
            callback(err, result)
        });
    } else {
        this.service.remove(data.criteria, callback);
    }
}


ControllerModule.prototype.delete = function(payloadData, callback) {

    var waterfallArray = [];
    waterfallArray.push(this.deleteService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};

exports.ControllerModule = ControllerModule;