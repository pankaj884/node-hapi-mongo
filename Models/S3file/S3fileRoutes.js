const Controller = require('../../Controllers');
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const commonRoutes = require('../../Routes/commonRoutesThings');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


function S3fileRoute(controller, requestSchema, mainKey, subKey , payload) {

    this.controller = controller;
}

S3fileRoute.prototype.getRoutes = function(request, reply) {
    return [];
}

module.exports = {
    's3file': new S3fileRoute(Controller.makeModule.s3file)
};
