const Controller = require('../Controllers');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const Joi = require('joi');


function handleControllerResponse(err, data, statusMessage) {

    if (!this.request.auth.isAuthenticated) {
        return this.reply('Authentication failed due to: ' + this.request.auth.error.message);
    }

    if (err == 1) {
        this.reply(UniversalFunctions.sendSuccess(statusMessage, data)).code(statusMessage.statusCode);
    } else {
        if (err) {
            this.reply(UniversalFunctions.sendError(err));
        } else {
            this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(201)
        }
    }
}

exports.handleControllerResponse = handleControllerResponse;


function handleControllerResponsePromise(context, fn, data) {

    if (data && data.fileToSend) {
        return new Promise(resolve => {
            fn.call(context, data, (err, data, statusMsg) => {
                if (!this.request.auth.isAuthenticated) {
                    resolve(this.request.auth.error.message);
                } else {
                    resolve(fs.readFileSync(data.path));
                }
            });
        });
    } else {
        return new Promise(resolve => {
            fn.call(context, data, (err, data, statusMsg) => {

                if (!this.request.auth.isAuthenticated) {
                    resolve(this.request.auth.error.message);
                } else {

                    if (err == 1) {
                        resolve(UniversalFunctions.sendSuccess(statusMessage, data));
                    } else {

                        if (err) {
                            resolve(UniversalFunctions.sendError(err));
                        } else {
                            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data, statusMsg));
                        }
                    }
                }
            });
        });
    }
}

exports.handleControllerResponsePromise = handleControllerResponsePromise;


function handleControllerResponseWithoutAuth(err, data, statusMessage) {
    if (err) {
        this.reply(UniversalFunctions.sendError(err));
    } else {
        this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(201)
    }
}

exports.handleControllerResponseWithoutAuth = handleControllerResponseWithoutAuth;


function handleControllerResponseWithoutAuthPromise(context, fn, data) {

    return new Promise(resolve => {

        fn.call(context, data, (err, data, statusMsg) => {

            if (err) {
                resolve(UniversalFunctions.sendError(err));
            } else {
                resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data, statusMsg))
            }
        });
    });
}

exports.handleControllerResponseWithoutAuthPromise = handleControllerResponseWithoutAuthPromise;

exports.handleControllerResponseWithoutAuth = handleControllerResponseWithoutAuth;

function handleControllerResponsePost(err, data, statusMessage) {

    if (err) {
        this.reply(UniversalFunctions.sendError(err));
    } else {
        this.reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
    }
}
exports.handleControllerResponsePost = handleControllerResponsePost;

function handleControllerResponseForFile(err, filePath, fileName) {

    if (!this.request.auth.isAuthenticated) {
        return this.reply('Authentication failed due to: ' + this.request.auth.error.message);
    }

    console.log(err, filePath, fileName);

    if (err) {
        this.reply(UniversalFunctions.sendError(err));
    } else {

        const fs = require('fs');
        const fileToSend = fs.readFileSync(filePath);
        const name = 'attachment; filename=' + fileName + ';';

        this.reply(fileToSend)
            .bytes(fileToSend.length)
            .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            .header('content-disposition', fileName);
    }
}
exports.handleControllerResponseForFile = handleControllerResponseForFile;

var routesPlugin = {
    'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
    },
};

exports.routesPlugin = routesPlugin;