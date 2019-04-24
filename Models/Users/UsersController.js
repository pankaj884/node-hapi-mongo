const Service = require('../../Services');
const Models = require('../../Models');
const ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const controllerHelper = require('../../Controllers/commonControllerFunctions');
const constant = require('../../constant');
const async = require('async');
const UploadManager = require('../../Lib/UploadManager');
const TokenManager = require('../../Lib/TokenManager');
const NotificationManager = require('../../Lib/NotificationManager');
const CodeGenerator = require('../../Lib/CodeGenerator');
const helper = require('./userControllerHelper');
const config = require('config');
const studentUrl = process.env.STUDENT_URL;
const adminUrl = process.env.ADMIN_URL;

function UsersController(service) {
    ControllerModule.call(this, service);
}

UsersController.prototype = Object.create(ControllerModule.prototype)

UsersController.prototype.userRegister = function userRegister(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.checkUserEmailExist.bind(null, data));
    waterfallArray.push(helper.cryptThePassword);
    waterfallArray.push(helper.insertUserIntoDb);
    waterfallArray.push(helper.sendVerificationEmail);
    waterfallArray.push(helper.updateAccessToken);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.table = function table(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(this.tableData.bind(this, data));
    waterfallArray.push(this.tableCount.bind(this));

    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            callback(err, data.tableData, data.extraData);
        }
    });
}


UsersController.prototype.tableData = function tableData(data, callback) {

    let criteria = {
        isDeleted: {
            $ne: true
        }
    };


    let projection = {};
    let limit = data.payload.perPage;
    let skip = limit * data.payload.page;
    let options = {
        lean: true,
        skip: skip,
        limit: limit,
    };

    if (data.payload.search && data.payload.search != '') {
        criteria['$or'] = [
            { email: { '$regex': data.payload.search, $options: '-i' } },
            { name: { '$regex': data.payload.search, $options: '-i' } },
        ]
    }

    if (data.payload.sortKey) {
        options.sort = {};
        var key = data.payload.sortKey;
        var order = data.payload.sortOrder;
        options.sort[key] = order;
    }

    this.service.view(criteria, projection, options, function(err, result) {
        if (err) {
            callback(err)
        } else {
            data.tableData = result;
            data.total = result.length;
            callback(null, data);
        }
    })
}



UsersController.prototype.tableCount = function tableCount(data, callback) {

    const criteria = {
        isDeleted: {
            $ne: true
        }
    };


    if (data.payload.search && data.payload.search != '') {
        criteria['$or'] = [
            { email: { '$regex': data.payload.search, $options: '-i' } },
            { name: { '$regex': data.payload.search, $options: '-i' } },
        ]
    }

    this.service.count(criteria, function(err, total) {
        if (err) {
            return callback(err);
        } else {
            data.extraData.total = total;

            callback(err, data);
        }
    });
}



UsersController.prototype.createUser = function createUser(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.checkEmailExist.bind(null, data));
    waterfallArray.push(helper.createThePassword);
    waterfallArray.push(helper.cryptThePassword);
    waterfallArray.push(helper.insertUserIntoDb);
    waterfallArray.push(helper.sendPasswordOnEmail);

    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result.userData);
        }
    });
}

UsersController.prototype.login = function studentLogin(data, callback) {

    data.criteria = {
        email: data.payload.email,
    };

    const waterfallArray = [];
    waterfallArray.push(helper.getUserFromDb.bind(null, data));

    waterfallArray.push(helper.matchPassword);
    waterfallArray.push(helper.updateAccessToken);

    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {
        callback(err, result);
    });
}

UsersController.prototype.resendOTP = function resendOTP(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.updateNewCodeIntoDb.bind(null, data));
    waterfallArray.push(helper.sendOtpToUser);
    waterfallArray.push(createCustomOtpMsgForCreateUser);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

function createCustomOtpMsgForCreateUser(data, callback) {

    var response = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PLEASE_ENTER_OTP;

    return callback(1, null, response);
}

UsersController.prototype.updateUser = function updateUser(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.updateUserProfileData.bind(null, data));

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.deleteById = function deleteById(data, callback) {

    data.criteria = { _id: data.params._id };
    data.setData = {
        '$set': {
            isDeleted: false
        }
    };
    this.service.edit(data.criteria, data.setData, { new: true }, callback);
}

UsersController.prototype.updateStatus = function updateStatus(data, callback) {

    var waterfallArray = [];
    waterfallArray.push(helper.updateUserProfileData.bind(null, data));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.changePassword = function changePassword(data, callback) {

    data.criteria = {
        _id: data.adminData._id
    }

    var waterfallArray = [];

    waterfallArray.push(helper.getUserFromDb.bind(null, data)); // also checking the old password
    waterfallArray.push(helper.cryptNewPassword);

    waterfallArray.push(helper.updateNewPassword);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.resetPassword = function resetPassword(data, callback) {

    data.criteria = {
        email: data.payload.email,
        passwordResetToken: data.payload.passwordResetToken
    }

    var waterfallArray = [];

    waterfallArray.push(helper.getUserFromDb.bind(null, data)); // also checking the old password
    waterfallArray.push(helper.checkPasswordResetToken);
    waterfallArray.push(helper.cryptNewPassword);
    waterfallArray.push(helper.updateNewPassword);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.getUser = function getUser(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.getUserProfileData.bind(null, data));
    waterfallArray.push(revertDataWithResponse);
    waterfallArray.push(getPermission);
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.getUserDetails = function getUserDetails(data, callback) {

    var waterfallArray = [];
    data.population = [{ path: 'organisationId' }]

    waterfallArray.push(helper.getUserProfileData.bind(null, data));
    waterfallArray.push(revertDataWithResponse);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

UsersController.prototype.facebookLogin = function facebookLogin(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(facebookGoogleHelper.webFacebookDetails.bind(null, payloadData));
    waterfallArray.push(facebookGoogleHelper.checkIfUserExistInDB);
    waterfallArray.push(facebookGoogleHelper.createOrUpdateUserInDB);
    waterfallArray.push(helper.updateAccessToken);

    async.waterfall(waterfallArray, waterFallHandler)

    function waterFallHandler(err, data, response) {

        if (err) {
            callback(err);
        } else {
            callback(null, data, response);
        }
    }
}

var revertDataWithResponse = function(data, callback) {
    return callback(null, data.profileData);
}

UsersController.prototype.getUserDashboardDetails = function getUserDashboardDetails(data, callback) {

    data.resToSend = {};

    data.resToSend.userData = {
        _id: data.userData._id,
        name: data.userData.name,
        email: data.userData.email,
        userRole: data.userData.userRole,
        userGenId: data.userData.userGenId,
        profilePicURL: data.userData.profilePicURL,
        gender: data.userData.gender,
        token: data.userData.accessTokenDetails.accessToken,
        countryCode: data.userData.countryCode,
        phone: data.userData.phone,
        phoneVerified: data.userData.phoneVerified
    };

    var parallerlArray = {};

    parallerlArray.notifCount = helper.getUsersNotificationCount.bind(null, data);
    parallerlArray.interests = helper.getAllInterestsAtOnce.bind(null, data);

    async.parallel(parallerlArray, parallelHandler)

    function parallelHandler(err, response) {
        if (err) {
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
        } else {
            data.resToSend.notifCount = response.notifCount;
            data.resToSend.interests = response.interests;
            return callback(null, data.resToSend);
        }
    }
}

UsersController.prototype.emailVerify = function emailVerify(data, callback) {

    const criteria = {
        emailVerificationToken: data.payload.token,
        isDeleted: false
    };

    const setQuery = {
        $set: {
            emailVerified: true,
            status: "ACTIVE",
        },
        $unset: {
            emailVerificationToken: 1
        }
    };
    const options = { new: true };

    Service.makeModule.users.edit(criteria, setQuery, options, function(err, updatedData) {

        if (err) {
            callback(err)
        } else if (!updatedData) {
            callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CODE)
        } else {
            callback(null, UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT)
        }
    });
}

UsersController.prototype.logoutUser = function logoutUser(data, callback) {

    if (!data.adminData || !data.adminData._id) {
        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {

        const criteria = {
            accessToken: data.adminData.accessToken
        };

        Service.makeModule.accessTokens.remove(criteria, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT)
            }
        });
    }
}


UsersController.prototype.forgotPassword = function forgotPassword(data, callback) {

    const waterfallArray = [];

    data.criteria = {
        email: data.payload.email,
        userType: constant.APP_CONSTANTS.DATABASE.userType.organisationStudent
    };
    waterfallArray.push(helper.getUserFromDb.bind(null, data));
    waterfallArray.push(helper.getOrganisationFromDb);
    waterfallArray.push(helper.updateForgotPasswordToken);
    waterfallArray.push(helper.sendForgotPasswordEmail);
    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {
        callback(err, {
            message: "Success"
        });
    });


}

UsersController.prototype.verifyOTP = function verifyOTP(data, callback) {

    var updatedUserData = null;
    if (!data.payload || !data.userData._id) {
        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        async.series([
            function(cb) {
                if (data.payload.otpCode == data.userData.otpCode) {
                    cb();
                } else {
                    cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CODE)
                }
            },
            function(cb) {
                var criteria = {
                    _id: data.userData._id,
                    otpCode: data.payload.otpCode
                };
                var setQuery = {
                    $set: {
                        phoneVerified: true,
                    },
                    $unset: {
                        otpCode: 1
                    }
                };
                var options = {
                    new: true
                };
                Service.makeModule.users.edit(criteria, setQuery, options, function(err, updatedData) {

                    if (err) {
                        console.log('verify otp callback error : ', err)

                        cb(err)
                    } else {
                        if (!updatedData) {
                            cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CODE)
                        } else {

                            updatedUserData = updatedData;
                            cb();
                        }
                    }
                });
            }
        ], function(err, result) {
            if (err) {
                callback(err)
            } else {
                callback(null, updatedUserData);
            }
        });
    }
}



module.exports = {
    'users': new UsersController(Service.makeModule.users)
};;