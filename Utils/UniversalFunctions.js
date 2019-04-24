var Joi = require('joi');
var async = require('async');
var MD5 = require('md5');
var Boom = require('boom');
var CONFIG = require('../constant');
var Models = require('../Models');
var randomstring = require("randomstring");
var GeoPoint = require('geopoint');
var distance = require('google-distance-matrix');
distance.key(CONFIG.APP_CONSTANTS.SERVER.GOOGLE_API_KEY);
var NotificationManager = require('../Lib/NotificationManager');
var validator = require('validator');
var advancedFunctions = require('./commonAdvanceFunctions');
var bcrypt = require('bcryptjs');

const saltRounds = 10;

var VALID_ERRAND_STATUS_ARRAY = [];
for (var key in CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS) {
    if (CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS.hasOwnProperty(key)) {
        VALID_ERRAND_STATUS_ARRAY.push(CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS[key])
    }
}

var calculateDeliveryCost = function(originLatlong, destLatLong, callback) {
    var estimatedCost = CONFIG.APP_CONSTANTS.SERVER.BASE_DELIVERY_FEE;
    calculateDistanceViaGoogleDistanceMatrix(originLatlong, destLatLong, function(err, distanceInMiles) {
        console.log('distances', err, distanceInMiles)
        if (err) {
            callback(err)
        } else {
            distanceInMiles = distanceInMiles && distanceInMiles.toFixed() || 0;
            estimatedCost = estimatedCost + distanceInMiles * CONFIG.APP_CONSTANTS.SERVER.COST_PER_KM;
            callback(null, estimatedCost)
        }
    })
};

var calculateDistanceViaGoogleDistanceMatrix = function(origin, destination, callback) {
    //TODO return distance instance of duration or both
    var origins = [origin];
    var destinations = [destination];
    var duration = null;

    distance.matrix(origins, destinations, function(err, distances) {
        if (err) {
            callback(err)
        } else if (distances.status == 'OK' && distances.rows && distances.rows[0] && distances.rows[0].elements &&
            distances.rows[0].elements[0] && distances.rows[0].elements[0].duration && distances.rows[0].elements[0].duration.hasOwnProperty('value')) {
            duration = (distances.rows[0].elements[0].duration.value) / 60;
        }
        callback(null, duration);
    });
};

var sendError = function(data, language) {
    console.trace('ERROR OCCURED ', data)

    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        console.log('attaching resposnetype', data.type)
        var errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else {
        var errorToSend = '';
        if (typeof data == 'object') {
            if (data.name == 'MongoError') {
                // errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if (data.code = 11000) {
                    var duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}', '');
                    errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1') > -1) {
                        errorToSend = CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            } else if (data.name == 'ApplicationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name == 'ValidationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name == 'CastError') {
                // errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        } else {
            errorToSend = data
        }
        var customErrorMessage = errorToSend;
        if (typeof customErrorMessage == 'string') {
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        var errorResponse = Boom.create(400, customErrorMessage);
        errorResponse.success = false;

        console.log(errorResponse)
        return errorResponse;
    }
};

var sendSuccess = function(successMsg, data, extraData) {

    // console.log('**************** sendSuccess ****************',successMsg,data,extraData);

    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;

    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {

        return { statusCode: successMsg.statusCode, message: successMsg.customMessage, data: data || {}, success: successMsg.success || null, extraData: extraData || null };

    } else {
        return { statusCode: 200, message: successMsg, success: true, data: data || null, extraData: extraData || null };

    }
};

var checkDuplicateValuesInArray = function(array) {
    console.log('array', array)
    var storeArray = [];
    var duplicateFlag = false;
    if (array && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (storeArray.indexOf(array[i]) == -1) {
                console.log('push', array[i])
                storeArray.push(array[i])
            } else {
                console.log('break')
                duplicateFlag = true;
                break;
            }
        }
    }
    storeArray = [];
    return duplicateFlag;
};

// var failActionFunction = function (request, reply, error,source) {


//  // console.log('********* inside failfunction request ***********',request);
//  // console.log('********* inside failfunction reply ***********',reply);
//  // console.log('********* inside failfunction source ***********',source);
//  console.log('********* inside failfunction error ***********',error,error.output.payload.validation);

//     var customErrorMessage = '';



//     if (error.output.payload.message.indexOf("[") > -1) {
//         customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
//     } else {
//         customErrorMessage = error.output.payload.message;
//     }
//     customErrorMessage = customErrorMessage.replace(/"/g, '');
//     customErrorMessage = customErrorMessage.replace('[', '');
//     customErrorMessage = customErrorMessage.replace(']', '');
//     error.output.payload.message = customErrorMessage;
//     delete error.output.payload.validation
//     return sendError(error);
// };


var failActionFunction = function(request, reply, error, source) {

    console.log('******* failActionFunction error **************', error.output.payload.validation);


    var customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.customMessage = customErrorMessage;


    delete error.output.payload.validation;

    console.log('******* failActionFunction **************', error.output.payload);

    return sendError(error.output.payload);
    // return reply(error);
};


var customQueryDataValidations = function(type, key, data, callback) {
    var schema = {};
    switch (type) {
        case 'PHONE_NO':
            schema[key] = Joi.string().regex(/^[0-9]+$/).length(10);
            break;
        case 'NAME':
            schema[key] = Joi.string().regex(/^[a-zA-Z ]+$/).min(2);
            break;
        case 'BOOLEAN':
            schema[key] = Joi.boolean();
            break;
    }
    var value = {};
    value[key] = data;

    Joi.validate(value, schema, callback);
};


var authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required().default("bearer " + CONFIG.APP_CONSTANTS.ADMIN_ACCESS_TOKEN)
}).unknown();

var getEmbeddedDataFromMongo = function(dataAry, keyToSearch, referenceIdToSearch, embeddedFieldModelName, variableToAttach, callback) {
    if (!dataAry || !keyToSearch || !variableToAttach || !embeddedFieldModelName || !Models[embeddedFieldModelName]) {
        callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        if (dataAry.length > 0) {
            var taskToRunInParallel = [];
            dataAry.forEach(function(dataObj) {
                taskToRunInParallel.push((function(dataObj) {
                    return function(embeddedCB) {
                        if (!dataObj[referenceIdToSearch]) {
                            callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                        } else {
                            var criteria = {};
                            criteria[keyToSearch] = dataObj[referenceIdToSearch];
                            Models[embeddedFieldModelName].find(criteria, function(err, modelDataAry) {
                                if (err) {
                                    embeddedCB(err)
                                } else {
                                    if (modelDataAry) {
                                        dataObj[variableToAttach] = modelDataAry
                                    }
                                    embeddedCB()
                                }
                            })
                        }

                    }
                })(dataObj));
            });

            async.parallel(taskToRunInParallel, function(err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, dataAry)
                }
            })

        } else {
            callback(null, dataAry)
        }
    }
};

var CryptData = function(stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};

var CryptPassword = function(stringToCrypt, callback) {

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            return callback(err);
        } else {
            bcrypt.hash(stringToCrypt, salt, callback);
        }
    });
};

var matchPassword = function(password, hash, callback) {

    bcrypt.compare(password, hash, function(err, res) {

        if (err) {
            return callback(err);
        } else if (!res) {
            return callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
        } else {
            return callback(null, res);
        }
        // res === false 
    });
};


var generateRandomString = function() {
    return randomstring.generate(7);
};

var filterArray = function(array) {
    return array.filter(function(n) {
        return n != undefined && n != ''
    });
};

var sanitizeName = function(string) {
    return filterArray(string && string.split(' ') || []).join(' ')
};

var verifyEmailFormat = function(string) {
    return validator.isEmail(string)
};

var getFileNameWithUserId = function(thumbFlag, fullFileName, userId) {
    var prefix = CONFIG.APP_CONSTANTS.DATABASE.profilePicPrefix.Original;

    var ext = fullFileName;

    if (thumbFlag) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.profilePicPrefix.Thumb;
    }

    if (!userId) {
        return prefix + ext;
    } else {
        return prefix + userId + ext;
    }
};

var getFileNameWithUserIdWithCustomPrefix = function(thumbFlag, fullFileName, type, userId) {
    var prefix = '';
    if (type == CONFIG.APP_CONSTANTS.DATABASE.FILE_TYPES.LOGO) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.LOGO_PREFIX.ORIGINAL;
    } else if (type == CONFIG.APP_CONSTANTS.DATABASE.FILE_TYPES.DOCUMENT) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.DOCUMENT_PREFIX;
    }
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag && type == CONFIG.APP_CONSTANTS.DATABASE.FILE_TYPES.LOGO) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.LOGO_PREFIX.THUMB;
    }
    return prefix + userId + ext;
};

var getDistanceBetweenPoints = function(origin, destination) {
    var start = new GeoPoint(origin.lat, origin.long);
    var end = new GeoPoint(destination.lat, destination.long);
    return start.distanceTo(end, true);
};

var validateLatLongValues = function(lat, long) {
    var valid = true;
    if (lat < -90 || lat > 90) {
        valid = false;
    }
    if (long < -180 || long > 180) {
        valid = false;
    }
    return valid;
};
var deleteUnnecessaryUserData = function(userObj) {
    console.log('deleting>>', userObj)
    delete userObj['__v'];
    delete userObj['password'];
    delete userObj['accessToken'];
    delete userObj['emailVerificationToken'];
    delete userObj['passwordResetToken'];
    delete userObj['registrationDate'];
    delete userObj['OTPCode'];
    delete userObj['facebookId'];
    delete userObj['codeUpdatedAt'];
    delete userObj['deviceType'];
    delete userObj['deviceToken'];
    delete userObj['appVersion'];
    delete userObj['isBlocked'];
    console.log('deleted', userObj)
    return userObj;
};


var convertCamelCaseString = function(string, seperator) {
    var s = string;
    console.log(string)
    return capitalizeFirstLetter(s.replace(/\.?([A-Z]+)/g, function(x, y) { return seperator + y }).replace(/^_/, ""));

}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function decimalToTwoPoints(num) {
    return parseInt(Math.round(num * 100)) / 100;
}

module.exports = {
    sendError: sendError,
    sendSuccess: sendSuccess,
    calculateDeliveryCost: calculateDeliveryCost,
    checkDuplicateValuesInArray: checkDuplicateValuesInArray,
    CryptData: CryptData,
    CryptPassword: CryptPassword,
    matchPassword: matchPassword,
    failActionFunction: failActionFunction,
    NotificationManager: NotificationManager,
    authorizationHeaderObj: authorizationHeaderObj,
    getEmbeddedDataFromMongo: getEmbeddedDataFromMongo,
    verifyEmailFormat: verifyEmailFormat,
    sanitizeName: sanitizeName,
    deleteUnnecessaryUserData: deleteUnnecessaryUserData,
    getDistanceBetweenPoints: getDistanceBetweenPoints,
    validateLatLongValues: validateLatLongValues,
    filterArray: filterArray,
    CONFIG: CONFIG,
    VALID_ERRAND_STATUS_ARRAY: VALID_ERRAND_STATUS_ARRAY,
    generateRandomString: generateRandomString,
    getFileNameWithUserId: getFileNameWithUserId,
    getFileNameWithUserIdWithCustomPrefix: getFileNameWithUserIdWithCustomPrefix,
    customQueryDataValidations: customQueryDataValidations,
    advancedFunctions: advancedFunctions,
    convertCamelCaseString: convertCamelCaseString,
    decimalToTwoPoints: decimalToTwoPoints
};