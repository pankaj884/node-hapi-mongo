const Controller = require('../Controllers');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const Joi = require('joi');
const commonRoutes = require('./commonRoutesThings');
const _ = require('underscore')

function RoutesModule(controller, requestSchemas, moduleName, apiName, payload, isNotAutherize) {

    this.controller = controller;
    this.requestSchemas = requestSchemas;
    this.moduleName = moduleName;
    this.apiName = apiName;
    this.payload = payload;
    this.isNotAutherize = isNotAutherize
    this.extraRoutes = [];
}

RoutesModule.prototype.controller = function(controller) {
    this.controller = controller;
    return this;
}

RoutesModule.prototype.requestSchemas = function(requestSchemas) {
    this.requestSchemas = requestSchemas;
    return this;
}

RoutesModule.prototype.moduleName = function(moduleName) {
    this.moduleName = moduleName;
    return this;
}
RoutesModule.prototype.apiName = function(apiName) {
    this.apiName = apiName;
    return this;
}
RoutesModule.prototype.payload = function(payload) {
    this.payload = payload;
    return this;
}

RoutesModule.prototype.isNotAutherize = function(isNotAutherize) {
    this.isNotAutherize = isNotAutherize;
    return this;
}

RoutesModule.prototype.get = function(request, reply) {

    try {

        var data = {
            criteria: JSON.parse(request.query.criteria),
            projection: JSON.parse(request.query.projection),
            options: JSON.parse(request.query.options)
        };

        if (request.projectionRestriction) {

            var count = 0;
            for (var key in data.projection) {
                count++;
                if (!request.projectionRestriction[key]) {
                    delete data.projection[key]
                }
            }

            if (count == 0) {
                data.projection = request.projectionRestriction
            }
        }

        if (request.extraPayloadCondition && request.extraPayloadCondition.id) {

            data.criteria[request.extraPayloadCondition.id] = request.auth.credentials[request.extraPayloadCondition.dataKey]._id
        }

    } catch (err) {
        console.error(err);
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    }
    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.list, data);
};

RoutesModule.prototype.getUnAuth = function(request, reply) {
    try {
        var data = {
            criteria: JSON.parse(request.query.criteria),
            projection: JSON.parse(request.query.projection),
            options: JSON.parse(request.query.options)
        };
    } catch (err) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    }

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.list, data);
};

RoutesModule.prototype.options = function(request, reply) {
    return UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, {})
}

RoutesModule.prototype.getRoutes = function() {
    return this.extraRoutes;
}

RoutesModule.prototype.getAllRoute = function(auth, moduleOwnerName, extraConditions, projectionRestriction) {  
    return this;
}

exports.Routes = RoutesModule;