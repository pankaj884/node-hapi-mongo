const routesModule = require('../../Routes/RoutesModule').Routes;
const Controller = require('../../Controllers');
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const commonRoutes = require('../../Routes/commonRoutesThings');
const Joi = require('joi');

const payload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
}

const schema = {
    put: {},
    post: {}
}


function AccessTokensRoute(controller, requestSchema, mainKey, subKey , payload) {
    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

AccessTokensRoute.prototype = Object.create(routesModule.prototype) // inheritance happening
AccessTokensRoute.prototype.getParentRoutes = AccessTokensRoute.prototype.getRoutes;

AccessTokensRoute.prototype.getRoutes = function(request, reply) {

    const newRoutes =[]
    return newRoutes;
}

module.exports = {

    'accessTokens': new AccessTokensRoute(Controller.makeModule.accessTokens, schema, 'admins', 'accessTokens')

};