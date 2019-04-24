'use strict';

var TokenManager = require('../Lib/TokenManager');
var UniversalFunctions = require('../Utils/UniversalFunctions');

const plugin = {

    name: 'auth-token-plugin',

    register: function(server, options) {

        (async() => {

            await server.register(require('hapi-auth-bearer-token'))
            
            server.auth.strategy('UserAuth', 'bearer-access-token', {
                allowQueryToken: false,
                allowMultipleHeaders: true,
                accessTokenName: 'accessToken',
                validate: async(request, token, h) => {
                    return new Promise((resolve) => {

                        TokenManager.verifyToken(token, function(err, response) {

                            if (err || !response || !response.length || !response[0].referal.referId) {
                                const isValid = false;

                                const credentials = {
                                    token: token,
                                    adminData: null
                                };

                                resolve({ isValid, credentials, credentials });
                            } else {
                                response[0].userId = response[0].referal.referId;

                                const isValid = true;

                                const credentials = {
                                    token: token,
                                    adminData: response[0].userId
                                };
                                resolve({ isValid, credentials, credentials });
                            }
                        });
                    });
                }
            });

            server.auth.strategy('AdminAuth', 'bearer-access-token', {
                allowQueryToken: false,
                allowMultipleHeaders: true,
                accessTokenName: 'accessToken',
                validate: async(request, token, h) => {
                    return new Promise((resolve) => {

                        TokenManager.verifyAdminToken(token, function(err, response) {

                            if (err || !response || !response.length || !response[0].referal.referId) {
                                const isValid = false;

                                const credentials = {
                                    token: token,
                                    adminData: null
                                };

                                resolve({ isValid, credentials, credentials });
                            } else {

                                response[0].userId = response[0].referal.referId;
                                const isValid = true;

                                const credentials = {
                                    token: token,
                                    adminData: response[0].userId
                                };
                                resolve({ isValid, credentials, credentials });
                            }
                        });
                    });
                }
            });


        })();
    }
}

module.exports = plugin