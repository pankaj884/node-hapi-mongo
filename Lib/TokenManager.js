'use strict';

const Config = require('../constant');
const Jwt = require('jsonwebtoken');
const async = require('async');
const Service = require('../Services');
const Controllers = require('../Controllers');
const config = require('config');
const constant = require('../constant');

function CheckIfControllerNotInitialised() {

    if (!Controllers || !Controllers.makeModule) {
        Controllers = require('../Controllers');
    }
}

var verifyToken = function(token, callback) {
    var criteria = {
        accessToken: token,
    };
    criteria.population = [{ path: 'referal.referId' }]
    Service.makeModule.accessTokens.view(criteria, {}, { lean: true }, callback);
};



var verifyAdminToken = function(token, callback) {

    const criteria = {
        accessToken: token,
    };

    criteria.population = [{ path: 'referal.referId' }]

    Service.makeModule.accessTokens.view(criteria, {}, { lean: true }, function(err, result) {
        if (err) {
            return callback(err);
        } else if (result.length) {
            return callback(null, result);
        } else {
            return callback(null, null);
        }
    });
};

const setAdminToken = function(tokenData, callback) {

    tokenData.time = new Date().getTime();
    tokenData.exp = new Date().setMinutes(new Date().getMinutes() + 60 * 24 * 7);

    const tokenToSend = Jwt.sign(tokenData, config.get('JWT_SECRET_KEY'));
    callback(null, tokenToSend)
};

const setTokenForAdmin = function(tokenData, callback) {

    tokenData.time = new Date().getTime();
    tokenData.exp = new Date().setMinutes(new Date().getMinutes() + 60 * 24 * 7);

    let accessToken = Jwt.sign(tokenData, config.get('JWT_SECRET_KEY'));

    let insertObj = {
        accessToken: accessToken,
        referal: {
            kind: 'Admin',
            referId: tokenData.id
        }
    };
    Service.makeModule.accessTokens.add(insertObj, callback);
};



const setToken = function(tokenData, callback) {

    tokenData.time = new Date().getTime();
    tokenData.exp = new Date().setMinutes(new Date().getMinutes() + 60 * 24 * 7);
    let accessToken = Jwt.sign(tokenData, config.get('JWT_SECRET_KEY'));

    let insertObj = {
        accessToken: accessToken,
        referal: {
            kind: 'Users',
            referId: tokenData.id
        }
    };
    Service.makeModule.accessTokens.add(insertObj, callback);
};

var expireToken = function(token, callback) {
    Jwt.verify(token, config.get('JWT_SECRET_KEY'), function(err, decoded) {
        if (err) {
            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            callback(err, {});
        }
    });
};

var decodeToken = function(token, callback) {
    Jwt.verify(token, config.get('JWT_SECRET_KEY'), function(err, decodedData) {
        if (err) {
            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            callback(null, decodedData)
        }
    })
};

module.exports = {
    setToken: setToken,
    setTokenForAdmin: setTokenForAdmin,
    verifyToken: verifyToken,
    verifyAdminToken: verifyAdminToken,
    decodeToken: decodeToken,
};