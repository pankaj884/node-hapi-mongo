const Controller = require('../../Controllers');
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const commonRoutes = require('../../Routes/commonRoutesThings');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function TestingRoute(controller) {
        this.controller = controller;
}

TestingRoute.prototype.table = function(request, reply){

    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;
    
    if (!adminData){
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }
    const data = {
        payload: request.query,
        adminData: adminData,
    };


    data.extraData = {
        perPage: request.query.perPage,
        page: request.query.page,
        total: 0
    };


    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller , this.controller.table , data);
}

TestingRoute.prototype.post = function(request, reply) {

    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;
    
    if (!adminData){
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    const data = {
        payload: request.payload,
        adminData: adminData,
    };

   return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller,this.controller.add,data);

}

TestingRoute.prototype.put = function(request, reply) {

    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;
    
    if (!adminData){
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    const data = {
        payload: request.payload,
        params : request.params,
        adminData: adminData,
    };

   return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller,this.controller.edit,data);

}

TestingRoute.prototype.deleteById = function(request, reply) {

    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;
    
    if (!adminData){
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    const data = {
        params : request.params,
        adminData: adminData,
    };

   return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller,this.controller.deleteById,data);
}

TestingRoute.prototype.getById = function(request, reply) {

    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;
    
    if (!adminData){
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    const data = {
        payload : request.payload,
        params : request.params,
        adminData: adminData,
    };

   return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller,this.controller.getById,data);
}

TestingRoute.prototype.getRoutes = function(request, reply) {

    const newRoutes =[{
            method: 'GET',
            path: '/v1/testing',
            handler: this.table.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query:{
                        search: Joi.string().optional(),
                        sortKey: Joi.string().optional(),
                        sortOrder: Joi.number().optional(),
                        page: Joi.number().required(),
                        perPage: Joi.number().required(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'list all testing',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'POST',
            path: '/v1/testing',
            handler: this.post.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload:{

                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'add in testing',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'PUT',
            path: '/v1/testing/{_id}',
            handler: this.put.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: {

                    },
                    params: {
                        _id: Joi.objectId().required()
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Edit in testing',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'DELETE',
            path: '/v1/testing/{_id}',
            handler: this.deleteById.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: {
                        _id: Joi.objectId().required()
                    },
                    failAction: UniversalFunctions.failActionFunction

                },
                description: 'Delete in testing',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'GET',
            path: '/v1/testing/{_id}',
            handler: this.getById.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: {
                        _id: Joi.objectId().required()
                    },
                    query: {
                       
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get by id testing',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        }
    ]
    return newRoutes;
}

module.exports = {
    'testing': new TestingRoute(Controller.makeModule.testing)
};
