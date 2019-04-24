const async = require('async');
const request = require('request');
const jwt = require('jwt-simple');
const Service = require('../../Services');
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const TokenManager = require('../../Lib/TokenManager');
const UploadManager = require('../../Lib/UploadManager');
const CodeGenerator = require('../../Lib/CodeGenerator');
const NotificationManager = require('../../Lib/NotificationManager');
const Config = require('../../constant');
const config = require('config');

function log() {

    console.log("----------------------------------><-----------------------------");
    console.log.apply(null, arguments);
}

function echo() {
    var args, file, frame, line, method;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];

    frame = stackTrace.get()[1];
    file = path.basename(frame.getFileName());
    line = frame.getLineNumber();
    method = frame.getFunctionName();
    console.log("---------------------------------->----------------------------------<-----------------------------");

    console.log("" + file + ":" + line + " in " + method + "()");
};


/*
 |--------------------------------------------------------------------------
 | Facebook Mobile login Verification 
 |--------------------------------------------------------------------------
 */
var mobileFacebookVerification = function(data, callback) {

    var request = require('request');
    var urls = "https://graph.facebook.com/" + data.payload.facebookId + "?access_token=" + data.payload.facebookAccessToken;

    request(urls, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            var output = JSON.parse(body);

            if (output['error']) {
                return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.NOT_AUTHENTICATED_FACEBOOK_USER);
            } else {
                return callback(null, data);
            }
        } else {
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.NOT_AUTHENTICATED_FACEBOOK_USER);
        }
    });
}
exports.mobileFacebookVerification = mobileFacebookVerification;


/*
 |--------------------------------------------------------------------------
 | Google Mobile login Verification 
 |--------------------------------------------------------------------------
 */
function mobileGoogleVerification(data, callback) {

    var url = config.get('mobileGoogle').verificationUrl + data.payload.googleCode;

    request(url, function(error, result, body) {
        if (!error && result.statusCode == 200) {
            return callback(null, data);
        } else {
            return callback({
                statusCode: 400,
                success: false,
                type: 'INVALID_GOOGLE_ACCESSTOKEN',
                customMessage: "invalid request"
            });
        }
    });
}

exports.mobileGoogleVerification = mobileGoogleVerification;



/*
 |--------------------------------------------------------------------------
 | Website Login with Google
 |--------------------------------------------------------------------------
 */
function webGoogleDetails(data, callback) {

    var accessTokenUrl = config.get('webGoogle').webGoogle;
    var peopleApiUrl = config.get('webGoogle').peopleApiUrl;
    var params = {
        code: data.payload.code,
        client_id: data.payload.clientId,
        client_secret: config.get('webGoogle').secret,
        redirect_uri: data.redirectUri,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, {
        json: true,
        form: params
    }, function(err, response, token) {
        var accessToken = token.access_token;
        var headers = {
            Authorization: 'Bearer ' + accessToken
        };

        // Step 2. Retrieve profile information about the current user.
        request.get({
            url: peopleApiUrl,
            headers: headers,
            json: true
        }, function(err, response, profile) {
            if (profile.error) {
                return callback({

                    statusCode: 400,
                    success: false,
                    type: 'INVALID_GOOGLE_CLIENT',
                    customMessage: profile.error.message


                });
            }

            data.profile = profile;
            callback(null, data);

        });
    });
};

exports.webGoogleDetails = webGoogleDetails;


/*
 |--------------------------------------------------------------------------
 | Website Login with Facebook
 |--------------------------------------------------------------------------
 */
function webFacebookDetails(data, callback) {


    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'gender'];

    var accessTokenUrl = config.get('webFb').accessTokenUrl;
    var graphApiUrl = config.get('webFb').graphApiUrl + fields.join(',');

    var params = {
        code: data.payload.code,
        client_id: data.payload.clientId,
        client_secret: config.get('webFb').secret,
        redirect_uri: data.payload.redirectUri
    };



    // Step 1. Exchange authorization code for access token.
    request.get({
        url: accessTokenUrl,
        qs: params,
        json: true
    }, function(err, response, accessToken) {

        if (err) {
            echo();
        }
        if (response.statusCode !== 200) {
            return callback({
                statusCode: 400,
                success: false,
                type: 'INVALID_FACEBOOK_ACCESSTOKEN',
                customMessage: accessToken.error.message
            });
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({
            url: graphApiUrl,
            qs: accessToken,
            json: true
        }, function(err, response, profile) {
            if (err) {
                echo()
            }
            if (response.statusCode !== 200) {
                return callback({
                    message: profile.error.message
                });
            }
            data.profile = profile;
            callback(null, data)
        });
    });
};

exports.webFacebookDetails = webFacebookDetails;


function checkIfUserExistInDB(data, callback) {

    var criteria = {};

    criteria.isDeleted = false;

    if (data.payload.facebookId && data.payload.email) { // facebook mobile login

        var or1 = [{
            "otherCredentials.facebookId": data.payload.facebookId
        }, {
            "email": data.payload.email
        }];
    } else if (data.payload.googleId && data.payload.email) { // google mobile login

        var or1 = [{
            "otherCredentials.googleId": data.payload.googleId
        }, {
            "email": data.payload.email
        }];

    } else if (data.profile && data.profile.sub && data.profile.email) { // google web login

        var or1 = [{
            "otherCredentials.googleId": data.profile.sub
        }, {
            "email": data.profile.email
        }];

    } else if (data.profile && data.profile.id && data.profile.email) { // facebook web login

        var or1 = [{
            "otherCredentials.facebookId": data.profile.id
        }, {
            "email": data.profile.email
        }];

    } else {
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS);
    }

    
    criteria['$or'] = or1;

    var projection = {};
    var option = {
        lean: true
    };
    Service.makeModule.users.view(criteria, projection, option, function(err, result) {
        if (err) {
            return callback(err)
        } else {
            userFound = result && result[0] || null;

            if (userFound && userFound.isBlocked){
                return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ACCOUNT_BLOCKED);
            }

            data.userData = userFound;

            if (userFound)
                data._id = userFound._id;

            return callback(null, data);
        }
    });
}
exports.checkIfUserExistInDB = checkIfUserExistInDB;




function createOrUpdateUserInDB(data, callback) {

    if (data.userData == null) {

        var waterfallArray = [];

        waterfallArray.push(modifyUserDataForDB.bind(null, data));
        waterfallArray.push(createUserInDatabase);
        async.waterfall(waterfallArray, waterFallHandler)

        function waterFallHandler(err, result) {

            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        }
    } else {
        updateUserFacebookGoogleID(data, callback)
    }
}
exports.createOrUpdateUserInDB = createOrUpdateUserInDB;

function modifyUserDataForDB(data, callback) {

    if (data.payload.googleId || data.payload.facebookId) { // facebook, google mobile login
        var dataToSave = {
            name: data.payload.name,
            // deviceType: data.payload.deviceType,
            // deviceToken: data.payload.deviceToken,
            email: data.payload.email,
            // registrationDate: new Date().toISOString(),
            emailVerified: true,
            profilePicURL: {
                original: data.payload.profilePic,
                thumbnail: data.payload.profilePic
            }
        };
    } else if (data.profile && data.profile.gender && data.profile.email) { // facebook, google web login


        var dataToSave = {
            email: data.profile.email,
            // registrationDate: new Date().toISOString(),
        };
    } else {
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS);
    }

    if (data.payload.googleId) { // google mobile login
        dataToSave['otherCredentials.googleId'] = data.payload.googleId;
    } else if (data.payload.facebookId) { // facebook  mobile login
        dataToSave['otherCredentials.facebookId'] = data.payload.facebookId;
        dataToSave.gender = data.payload.gender;
    } else if (data.profile && data.profile.sub && data.profile.email) { // google web login

        dataToSave['otherCredentials.googleId'] = data.profile.sub;
        dataToSave.name = data.profile.given_name + ' ' + data.profile.family_name;
        dataToSave.profilePicURL = {
            original: data.profile.picture.replace("50", "150"),
            thumbnail: data.profile.picture.replace("50", "150")
        };
    } else if (data.profile && data.profile.id && data.profile.email) { // facebook web login

        dataToSave['otherCredentials.facebookId'] = data.profile.id;
        dataToSave.name = data.profile.first_name + ' ' + data.profile.last_name;
        dataToSave.profilePicURL = {
            original: 'https://graph.facebook.com/' + data.profile.id + '/picture?type=large',
            thumbnail: 'https://graph.facebook.com/' + data.profile.id + '/picture?type=large'
        };

    } else {
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS);
    }

    data.dataToSave = dataToSave;
    process.nextTick(callback.bind(null, null, data));
}


// it will take input as data to save
function createUserInDatabase(data, callback) {


    Service.makeModule.users.add(data.dataToSave, function(err, userDataFromDB) {
        if (err) {
            if (err.code == 11000 && err.message.indexOf('users.$email_1') > -1) {
                callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);

            } else {
                callback(err)
            }
        } else {

            data.userData = userDataFromDB;
            data._id = userDataFromDB._id;

            return callback(null, data);
        }
    })

}

function updateUserFacebookGoogleID(data, callback) {

    if (data.payload.facebookId) { // facebook mobile login
        var setQuery = {
            "otherCredentials.facebookId": data.payload.facebookId,
            "name": data.payload.name,
        };
    } else if (data.payload.googleId) { // google mobile login
        var setQuery = {
            "otherCredentials.googleId": data.payload.googleId,
        };
    } else if (data.profile.sub) { // google web login
        var setQuery = {
            "otherCredentials.googleId": data.profile.sub,
        };
    } else if (data.profile.id) { // facebook web login
        var setQuery = {
            "otherCredentials.facebookId": data.profile.id,
        };
    } else {
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS);
    }

    var criteria = {
        _id: data.userData._id
    };

    Service.makeModule.users.edit(criteria, setQuery, {
        new: true
    }, function(err, data) {

        callback(err, data);
    });
}
