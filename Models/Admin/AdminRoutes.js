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

function AdminRoute(controller) {

    this.controller = controller
}

AdminRoute.prototype.table = function(request, reply) {


    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;

    if (!adminData) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
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
    }, this.controller, this.controller.table, data);
}

AdminRoute.prototype.dashboard = function(request, reply) {


    const adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData || null;

    if (!adminData) {
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED);
    }
    const data = {
        payload: request.query,
        adminData: adminData,
    };

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.dashboard, data);
}

AdminRoute.prototype.login = function(request, reply) {

    const data = {};
    data.payload = request.payload;
    data.payload.email = data.payload.email.toLowerCase();

    return commonRoutes.handleControllerResponseWithoutAuthPromise(this.controller, this.controller.login, data);
}

AdminRoute.prototype.register = function(request, reply) {

    const data = {};

    data.payload = request.payload;

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.register, data);
}


AdminRoute.prototype.forgotPassword = function(request, reply) {

    const data = {};

    data.payload = request.payload;

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.forgotPassword, data);
}

AdminRoute.prototype.updateUser = function(request, reply) {

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

AdminRoute.prototype.resetPassword = function(request, reply) {

    const data = {};

    data.payload = request.payload;

    data.payload.email = data.payload.email.toLowerCase()

    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.resetPassword, data);
}

AdminRoute.prototype.uploadFile = function(request, reply) {

    const data = {};

    data.payload = request.payload;

    return new Promise((resolve, reject) => {

        this.controller.uploadFile(data, function(err, result) {

            if (err) {
                var finalResult = {
                    status: false,
                    msg: "Image upload failed, try again!"
                };

            } else {
                var finalResult = {
                    status: true,
                    _id: result._id,
                    originalName: result.originalName,
                    generatedName: result.generatedName,
                    imageUrl: result.original,
                    link: result.original,
                    msg: "Image upload successful"
                };
            }
            resolve(finalResult);
        });
    });
}


AdminRoute.prototype.changePassword = function(request, reply) {

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


AdminRoute.prototype.getUser = function(request, reply) {

    const data = {};

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

AdminRoute.prototype.logout = function(request, reply) {

    const data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (!data.adminData) {
        reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED))
    }

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.logoutUser, data);
}

AdminRoute.prototype.emailVerify = function(request, reply) {

    const data = {};

    data.payload = request.payload;

    data.payload.email = data.payload.email.toLowerCase();


    return commonRoutes.handleControllerResponseWithoutAuthPromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.emailVerify, data);
}


AdminRoute.prototype.getRoutes = function(request, reply) {

    const newRoutes = [{
            method: 'PATCH',
            path: '/adminApp/admins/changePassword',
            handler: this.changePassword.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: {
                        password: Joi.string().required().min(5).trim(),
                        newPassword: Joi.string().required().min(5).trim()
                    },
                    failAction: UniversalFunctions.failActionFunction

                },
                description: 'Change Password for User',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },

        {
            method: 'GET',
            path: '/adminApp/admins/isAuthenticated',
            handler: this.getUser.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Authenticate admin and get details',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },


         {
            method: 'GET',
            path: '/adminApp/dashboard',
            handler: this.dashboard.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Get User list',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'GET',
            path: '/adminApp/admins',
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
            method: 'POST',
            path: '/adminApp/admins/forgotPassword',
            handler: this.forgotPassword.bind(this),
            config: {
                validate: {
                    payload: {
                        email: Joi.string().required()
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Sends Reset Password Token To User',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PATCH',
            path: '/adminApp/admins/resetPassword',
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
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'PATCH',
            path: '/adminApp/admins/{_id}',
            handler: this.updateUser.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: {
                        _id: Joi.objectId().required()
                    },
                    payload: {
                        name: Joi.string().optional(),
                        phone: Joi.number().optional(),
                        status: Joi.string().optional().valid([
                            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.userStatus.active,
                            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.userStatus.hold,
                            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.userStatus.declined,
                        ]),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'admin Update profile',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'POST',
            path: '/adminApp/admins/emailVerify',
            handler: this.emailVerify.bind(this),
            config: {
                description: 'Email Verification',
                tags: ['api', 'admin'],
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
            method: 'POST',
            path: '/adminApp/upload',
            handler: this.uploadFile.bind(this),
            config: {
                payload: payload,
                validate: {
                    payload: {
                        tag: Joi.string().optional(),
                        file: Joi.any()
                            .meta({
                                swaggerType: 'file'
                            })
                            .required()
                            .description('image file')
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'upload a file',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },

        {
            method: 'PUT',
            path: '/adminApp/admins/logout',
            handler: this.logout.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'logout user',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },

        {
            method: 'POST',
            path: '/adminApp/auth/login',
            handler: this.login.bind(this),
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required().trim(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'login admin with email',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'POST',
            path: '/adminApp/auth/registration',
            handler: this.register.bind(this),
            config: {
                validate: {
                    payload: {

                        name: Joi.string().required(),
                        city: Joi.string().required(),
                        state: Joi.string().required(),
                        phone: Joi.number().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required().min(5).trim(),
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'register admin',
                tags: ['api', 'admin'],
                plugins: commonRoutes.routesPlugin
            }
        },

    ];

    return newRoutes;
}

module.exports = {
    'admin': new AdminRoute(Controller.makeModule.admin)
};