const Service = require('../../Services');
const Models = require('../../Models');
const ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const controllerHelper = require('../../Controllers/commonControllerFunctions');
const constant = require('../../constant');
const helper = require('./AdminControllerHelper');
const UploadManager = require('../../Lib/UploadManager');

function AdminController(service) {
    ControllerModule.call(this, service);
}

AdminController.prototype = Object.create(ControllerModule.prototype)


AdminController.prototype.register = function register(data, callback) {

    var waterfallArray = [];

    data.payload.userType = constant.APP_CONSTANTS.DATABASE.userType.organisationStudent;

    waterfallArray.push(helper.checkUserEmailExist.bind(null, data));
    waterfallArray.push(helper.cryptThePassword);
    waterfallArray.push(helper.insertUserIntoDb);
    waterfallArray.push(helper.sendVerificationEmail);
    waterfallArray.push(helper.updateAccessToken);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}


AdminController.prototype.login = function login(data, callback) {

    data.criteria = {
        email: data.payload.email
    };

    const waterfallArray = [];
    waterfallArray.push(helper.getUserFromDb.bind(null, data));
    waterfallArray.push(helper.matchPassword);
    waterfallArray.push(helper.updateAccessToken);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

AdminController.prototype.getUser = function getUser(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.getUserProfileData.bind(null, data));
    waterfallArray.push(revertDataWithResponse);
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

AdminController.prototype.dashboard = function getUser(data, callback) {

    var waterfallArray = [];

    data.stats = {};

    waterfallArray.push(helper.totalArticleCount.bind(null, data));
    waterfallArray.push(helper.totalTripCount);
    waterfallArray.push(helper.totalUserCount);
    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err,result){

        return callback(err,data.stats);
    });
}

AdminController.prototype.logoutUser = function logoutUser(data, callback) {

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


AdminController.prototype.table = function table(data, callback) {

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


AdminController.prototype.tableData = function tableData(data, callback) {

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
            console.log('******** IssueService err ***********', err);
            callback(err)
        } else {
            data.tableData = result;
            data.total = result.length;
            callback(null, data);
        }
    })
}

AdminController.prototype.updateUser = function updateUser(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(helper.updateUserProfileData.bind(null, data));

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}


AdminController.prototype.changePassword = function changePassword(data, callback) {

    data.criteria = {
        _id: data.adminData._id
    }

    var waterfallArray = [];

    waterfallArray.push(helper.getUserFromDb.bind(null, data)); // also checking the old password
    waterfallArray.push(helper.cryptNewPassword);

    waterfallArray.push(helper.updateNewPassword);

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback);
}

AdminController.prototype.forgotPassword = function forgotPassword(data, callback) {

    const waterfallArray = [];

    data.criteria = {
        email: data.payload.email,
    };

    waterfallArray.push(helper.getUserFromDb.bind(null, data));
    waterfallArray.push(helper.updateForgotPasswordToken);
    waterfallArray.push(helper.sendForgotPasswordEmail);
    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {
        callback(err, {
            message: "Success"
        });
    });


}

AdminController.prototype.resetPassword = function resetPassword(data, callback) {

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

AdminController.prototype.emailVerify = function emailVerify(data, callback) {

    const criteria = {
        emailVerificationToken: data.payload.token,
        isDeleted: false
    };

    const setQuery = {
        $set: {
            emailVerified: true,
            // status: "ACTIVE",
        },
        $unset: {
            emailVerificationToken: 1
        }
    };
    const options = { new: true };

    Service.makeModule.admin.edit(criteria, setQuery, options, function(err, updatedData) {

        if (err) {
            callback(err)
        } else if (!updatedData) {
            callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_CODE)
        } else {
            callback(null, UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT)
        }
    });
}


AdminController.prototype.uploadFile = function uploadFile(data, callback) {

    if (data.payload && data.payload.file) {

        const folder = data.payload.tag || 'random';

        UploadManager.uploadImageFileToS3Bucket(data.payload.file, folder, function(err, fileName) {

            if (err) {
                console.log("error in upload 1-2", fileName);
                return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.ERROR_PROFILE_PIC_UPLOAD);
            } else {

                const url = 'https://ctadg.sgp1.cdn.digitaloceanspaces.com' + '/' + folder + '/' + fileName;

                Service.makeModule.s3file.add({
                    tag: folder,
                    url: url,
                }, function(err, updatedData) {

                    if (err) {
                        callback(err)
                    } else {

                        // const dataToReturn2 = {
                        //     link: url,
                        //     // url: url,
                        //     // thumb: url,
                        //     // tag: fileName,
                        //     // name: fileName,
                        //     // id: updatedData._id.toString(),

                        //     original: url,
                        //     generatedName: fileName,
                        //     originalName: data.payload.file.filename
                        // };


                        const dataToReturn = {
                            _id: updatedData._id.toString(),
                            original: url,
                            generatedName: fileName,
                            originalName: data.payload.file.filename
                        };
                        return callback(null, dataToReturn);
                    }
                });
            }
        });

    } else {
        console.log("Upload file not available");
        return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.ERROR_PROFILE_PIC_UPLOAD);
    }
}



AdminController.prototype.tableCount = function tableCount(data, callback) {

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


var revertDataWithResponse = function(data, callback) {
    return callback(null, data.profileData);
}

module.exports = {
    'admin': new AdminController(Service.makeModule.admin)
};;