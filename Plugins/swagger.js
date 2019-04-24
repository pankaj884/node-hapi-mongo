'use strict';

//Register Swagger
var pack = require('../package');
// swaggerOptions = {
//   apiVersion: pack.version,
//   pathPrefixSize: 2

// };

var Inert = require('inert'),
    Vision = require('vision'),
    HapiSwagger = require('hapi-swagger');



var swaggerOptions = {
    pathPrefixSize: 1

};

function register(server, options) {

    (async() => {

        await server.register([Inert, Vision, {
                plugin: require('hapi-swaggered'),
                options: {
                    tagging: {
                        // mode : "tags",
                        pathLevel: 2
                    },
                    tags: {
                        'foobar/test': 'Example foobar description'
                    },
                    info: {
                        title: 'Api Doc',
                        version: '1.0'
                    }
                }
            }, {
                plugin: require('hapi-swaggered-ui'),
                options: {
                    title: 'User API',
                    path: '/docsUser',
                    authorization: {
                        field: 'authorization',
                        scope: 'header', // header works as well
                        valuePrefix: 'bearer ', // prefix incase
                        // defaultValue: 'demoKey',
                        placeholder: 'Enter your apiKey here'
                    },
                    defaultTags: ["user"],
                    // auth : 'UserAuth',
                    swaggerOptions: {
                        validatorUrl: null
                    }
                }
            }, {
                plugin: require('hapi-swaggered-ui'),
                options: {
                    title: 'Admin API',
                    path: '/docsAdmin',
                    authorization: {
                        field: 'authorization',
                        scope: 'header', // header works as well
                        valuePrefix: 'bearer ', // prefix incase
                        // defaultValue: 'demoKey',
                        placeholder: 'Enter your apiKey here'
                    },
                    defaultTags: ["admin"],
                    // auth : 'AdminAuth',
                    swaggerOptions: {
                        validatorUrl: null
                    }
                }
            }
        ]);
    })();
}
module.exports = {
    name: 'swagger-plugin',
    register: register
};