'use strict';

//External Dependencies
var Hapi = require('hapi');
const Handlebars = require('handlebars');
require('dotenv').config({ path: 'local.env' });

console.log("ENVIRONMENT : ", process.env.NODE_ENV);
//Internal Dependencies

var Plugins = require('./Plugins');
var Bootstrap = require('./Utils/BootStrap');
var config = require('config');

//Create Server
const server = new Hapi.Server({
    port: config.get('HAPI_PORT'),
    routes: {
        cors: {
            credentials: false,
            origin: 'ignore',
            headers: ['Authorization', 'Content-Type', 'If-None-Match']
        }
    }
});

//Register All Plugins
const provision = async() => {

    try {

        await server.register(Plugins)
        await server.register(require('vision'));

        server.views({
            engines: { html: Handlebars },
            relativeTo: __dirname,
            path: 'Views'
        });

        var Routes = require('./Routes');

        server.route(Routes);

        server.route({
            method: 'GET',
            path: '/',
            handler: function(req, res) {
                //TODO Change for production server
                return res.view('index')
            }
        });

        server.route({
            method: 'GET',
            path: '/testingPayment',
            handler: function(req, res) {
                //TODO Change for production server
                return res.view('dataFrom')
            }
        });

        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {
        console.log("error : ", e);
    }

}


provision();