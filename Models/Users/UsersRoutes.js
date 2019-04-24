const routesModule = require('../../Routes/RoutesModule').Routes;
const Controller = require('../../Controllers');
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const commonRoutes = require('../../Routes/commonRoutesThings');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const payload = {
    maxBytes: 90000000000,
    parse: true,
    output: 'file',
    allow: 'multipart/form-data',
    timeout: false
}

function UsersRoute(controller) {
    this.controller =controller;
}


UsersRoute.prototype.getConstantValues = function(request, reply) {

    var type = request.query.type

    if (UniversalFunctions.CONFIG.APP_CONSTANTS[type]) {
        return UniversalFunctions.sendSuccess(null, UniversalFunctions.CONFIG.APP_CONSTANTS[type])
    } else {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CONSTANT_TYPE)
    }
}


UsersRoute.prototype.login = function(request, reply) {

    var data = {};
    data.payload = request.payload;
    data.payload.email = data.payload.email.toLowerCase();

    return commonRoutes.handleControllerResponseWithoutAuthPromise(this.controller, this.controller.login, data);
}

UsersRoute.prototype.facebookLogin = function(request, reply) {

    var data = {};
    data.payload = request.payload;
    data.payload.email = data.payload.email.toLowerCase();

    return commonRoutes.handleControllerResponseWithoutAuthPromise(this.controller, this.controller.facebookLogin, data);
}

UsersRoute.prototype.googleLogin = function(request, reply) {

    var data = {};
    data.payload = request.payload;
    data.payload.email = data.payload.email.toLowerCase();

    return commonRoutes.handleControllerResponseWithoutAuthPromise(this.controller, this.controller.googleLogin, data);
}

UsersRoute.prototype.verifyOTP = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        return reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    data.payload = request.payload;

    return commonRoutes.handleControllerResponsePromise(this.controller, this.controller.verifyOTP, data);
}

UsersRoute.prototype.resendOTP = function(request, reply) {

    const data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        return reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    data.payload = request.payload;

    return commonRoutes.handleControllerResponsePromise(this.controller, this.controller.resendOTP, data);
}


UsersRoute.prototype.updateUser = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData && data.adminData._id != request.params._id) {
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED))
    }

    data.payload = request.payload;
    data.params = request.params;

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.updateUser, data);
}

UsersRoute.prototype.changePassword = function(request, reply) {

    const data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        return (UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED))
    }

    data.payload = request.payload;

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.changePassword, data);
}

UsersRoute.prototype.forgotPassword = function(request, reply) {

    var data = {};

    data.payload = request.payload;

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.forgotPassword, data);
}



UsersRoute.prototype.resetPassword = function(request, reply) {

    var data = {};

    data.payload = request.payload;

    data.payload.email = data.payload.email.toLowerCase()

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.resetPassword, data);
}

UsersRoute.prototype.logout = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED))
    }

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.logoutUser, data);
}

UsersRoute.prototype.verifyPasswordToken = function(request, reply) {

    var data = {};

    data.payload = request.params;

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.verifyPasswordToken, data);
}

UsersRoute.prototype.deleteById = function(request, reply) {

    var adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;

    if (!adminData) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
    }

    var data = {
        params: request.params,
        adminData: adminData,
    };

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.deleteById, data);
}

UsersRoute.prototype.emailVerify = function(request, reply) {

    var data = {};

    console.log('****** emailVerify *******', request.payload);

    data.payload = request.payload;

    data.payload.email = data.payload.email.toLowerCase();


    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.emailVerify, data);
}

UsersRoute.prototype.table = function(request, reply) {


    var adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;

    if (!adminData) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
    }
    var data = {
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
    }, this.controller, this.controller.table, data);
}



UsersRoute.prototype.userRegister = function(request, reply) {

    var data = {};

    data.payload = request.payload;
    data.payload.email = data.payload.email.toLowerCase();


    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.userRegister, data);
}

UsersRoute.prototype.dbChanges = function(request, reply) {

    var data = {};

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.dbChanges, data);
}


UsersRoute.prototype.organisationRegister = function(request, reply) {

    var data = {};

    data.payload = request.payload;

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.organisationRegister, data);
}

UsersRoute.prototype.correctDataInDB = function(request, reply) {

    const data = {};

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.correctDataInDB, data);
}

UsersRoute.prototype.getUser = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
    }

    data.payload = {
        _id: data.adminData._id
    };

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.getUser, data);
}

UsersRoute.prototype.getUserDetails = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
    }

    data.payload = {
        _id: data.adminData._id
    };
    data.params = request.params;

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.getUserDetails, data);
}

UsersRoute.prototype.getUserDashboardDetails = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        return reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED));
    }

    data.payload = request.params;

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.getUserDashboardDetails, data);
}

UsersRoute.prototype.getRoutes = function(request, reply) {

    const newRoutes = [{
            method: 'POST',
            path: '/app/auth/facebook',
            handler: this.facebookLogin.bind(this),
            config: {

                description: 'Login Via facebook For  User',
                tags: ['api', 'user'],
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
                }
            }
        }, {
            method: 'POST',
            path: '/app/auth/google',
            handler: this.googleLogin.bind(this),
            config: {

                description: 'Login Via google For  User',
                tags: ['api', 'user'],
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/app/auth/registration',
            handler: this.userRegister.bind(this),
            config: {
                validate: {
                    payload: {
                        name: Joi.string().trim().min(2).required(),
                        email: Joi.string().email().required(),
                        // phone: Joi.number().required(),
                        password: Joi.string().required().min(5).trim(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'register user',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },


        {
            method: 'PATCH',
            path: '/adminApp/users/{_id}',
            handler: this.updateUser.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: {
                        _id: Joi.objectId().required()
                    },
                    payload: {
                        name: Joi.string().optional().min(2),
                        tagIds: Joi.array().items(Joi.objectId().optional()).optional(),
                        // phone: Joi.number().required(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'User Update profile',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'PATCH',
            path: '/app/users/{_id}',
            handler: this.updateUser.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: {
                        _id: Joi.objectId().required()
                    },
                    payload: {
                        name: Joi.string().optional(),
                        tagIds: Joi.array().items(Joi.objectId().optional()).optional(),
                        phone: Joi.number().optional(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'User Update profile',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },

        {
            method: 'GET',
            path: '/adminApp/users',
            handler: this.table.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: {
                        search: Joi.string().optional().allow(''),
                        sortKey: Joi.string().optional(),
                        sortOrder: Joi.number().optional(),
                        page: Joi.number().required(),
                        perPage: Joi.number().required(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Get User list',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'GET',
            path: '/adminApp/users/{userId}',
            handler: this.getUserDetails.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    params: {
                        userId: Joi.objectId().required()
                    },
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'user get details',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'POST',
            path: '/app/auth/login',
            handler: this.login.bind(this),
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required().trim(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'login user with email',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'PUT',
            path: '/app/users/logout',
            handler: this.logout.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'logout user',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'POST',
            path: '/app/users/emailVerify',
            handler: this.emailVerify.bind(this),
            config: {
                description: 'Email Verification',
                tags: ['api', 'user'],
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        token: Joi.string().required(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                plugins: commonRoutes.routesPlugin
            }
        },


        {
            method: 'PATCH',
            path: '/app/users/changePassword',
            handler: this.changePassword.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: {
                        password: Joi.string().required().min(5).trim(),
                        newPassword: Joi.string().required().min(5).trim()
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Change Password for User',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'POST',
            path: '/app/users/forgotPassword',
            handler: this.forgotPassword.bind(this),
            config: {
                validate: {
                    payload: {
                        email: Joi.string().required()
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Sends Reset Password Token To User',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PATCH',
            path: '/app/users/resetPassword',
            handler: this.resetPassword.bind(this),
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        passwordResetToken: Joi.string().required(),
                        newPassword: Joi.string().min(5).required()
                    },
                    failAction: UniversalFunctions.failActionFunction

                },
                description: 'Reset Password for User',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: '/app/users/verifyPasswordToken/{token}',
            handler: this.verifyPasswordToken.bind(this),
            config: {
                validate: {
                    params: {
                        token: Joi.string().required()
                    },
                    failAction: UniversalFunctions.failActionFunction

                },
                description: 'Verify password reset token for User',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },

        {
            method: 'GET',
            path: '/app/isAuthenticated',
            handler: this.getUser.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Authenticate user and get details',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }
    ]
    return newRoutes;
}

module.exports = {
    'users': new UsersRoute(Controller.makeModule.users)
};