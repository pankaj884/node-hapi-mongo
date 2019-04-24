'use strict';

const routes = require('./RoutesModule').Routes;
const Controller = require('../Controllers');
let all = [];
let makeModule = {};

for (key in Controller.makeModule) {

    if (key == 'accessTokens') {
        makeModule[key] = require('./../Models/AccessTokens/AccessTokensRoutes').accessTokens;
    } else if (key == 'users') {
        makeModule[key] = require('./../Models/Users/UsersRoutes').users;
    } else if (key == 'increment') {
        makeModule[key] = require('./../Models/Increment/IncrementRoutes').increment;
    } else if (key == 's3file') {
        makeModule[key] = require('./../Models/S3file/S3fileRoutes').s3file;
    } else if (key == 'admin') {
        makeModule[key] = require('./../Models/Admin/AdminRoutes').admin;
    }

           else if (key == 'testing') {
 makeModule[key] = require('./../Models/Testing/TestingRoutes').testing;
}


if (makeModule[key]) {

        all = all.concat(makeModule[key].getRoutes());
    }
}

module.exports = all;